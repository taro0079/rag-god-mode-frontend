import { useCallback, useRef, useState } from "react"
import type { ChatMessage, ChatMetadata, UseChatOptions } from "./types"

const randomId = () => Math.random().toString(36).slice(2, 10)

interface ChatApiResponse {
  answer?: string
  content?: string
  reply?: string
  messages?: Array<{ role?: string; content?: string }>
  citations?: Array<Record<string, unknown>>
  used_docs?: number
}

const HISTORY_ROLES = new Set(["user", "assistant", "system"])

export function useChat(options: UseChatOptions = {}) {
  const { endpoint = "/chat", systemPrompt, historyLimit = 20 } = options

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = {
      id: randomId(),
      role: "user",
      content: input.trim(),
      createdAt: Date.now()
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    setError(null)

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const base = import.meta.env.VITE_API_BASE_URL || ""
      const historyItems = messages
        .filter((m) => HISTORY_ROLES.has(m.role))
        .slice(-historyLimit)
        .map(({ role, content }) => ({ role, content }))

      const payload = systemPrompt
        ? {
            question: userMsg.content,
            history: [
              { role: "system", content: systemPrompt },
              ...historyItems
            ]
          }
        : { question: userMsg.content, history: historyItems }

      console.log(base + endpoint, payload) // DEBUG
      const res = await fetch(base + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      // シンプル: 完全レスポンス(JSON)を想定
      // { reply: string } 形式 or { messages: ChatMessageLike[] }
      const data: ChatApiResponse = await res.json().catch(() => ({}))
      const assistantContent =
        typeof data.answer === "string"
          ? data.answer
          : typeof data.reply === "string"
          ? data.reply
          : Array.isArray(data.messages)
          ? data.messages[data.messages.length - 1]?.content || ""
          : typeof data.content === "string"
          ? data.content
          : ""
      const metadata: ChatMetadata = {
        citations: Array.isArray(data.citations) ? data.citations : undefined,
        used_docs:
          typeof data.used_docs === "number" ? data.used_docs : undefined
      }
      const content = assistantContent || "(no content)"
      const assistantMsg: ChatMessage = {
        id: randomId(),
        role: "assistant",
        content,
        createdAt: Date.now(),
        metadata
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e: any) {
      if (e?.name === "AbortError") return
      setError(e.message || "送信エラー")
      const errMsg: ChatMessage = {
        id: randomId(),
        role: "error",
        content: e.message || "送信エラー",
        createdAt: Date.now()
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }, [endpoint, historyLimit, input, loading, messages, systemPrompt])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setInput("")
  }, [])

  return {
    messages,
    input,
    setInput,
    send,
    loading,
    error,
    stop,
    reset
  }
}
