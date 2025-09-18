import { useCallback, useEffect, useRef } from "react"
import type { FormEvent } from "react"
import { useChat } from "./useChat"
import type { ChatMessage, ChatMetadata } from "./types"
import "./chat.css"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

interface ChatProps {
  title?: string
  placeholder?: string
  height?: string
}

function RoleLabel({ role }: { role: ChatMessage["role"] }) {
  switch (role) {
    case "user":
      return <span className="role role-user">You</span>
    case "assistant":
      return <span className="role role-assistant">AI</span>
    case "system":
      return <span className="role role-system">System</span>
    case "error":
      return <span className="role role-error">Error</span>
    default:
      return <span className="role">{role}</span>
  }
}

function CitationList({ metadata }: { metadata?: ChatMetadata }) {
  const citations = metadata?.citations
  if (!citations || citations.length === 0) return null
  return (
    <div className="citations">
      <span className="citations-title">引用</span>
      <ul>
        {citations.map((cite, idx) => {
          const labelBase = cite.issue_id
            ? `#${cite.issue_id}`
            : `参照${idx + 1}`
          const label = cite.updated_on
            ? `${labelBase} (${cite.updated_on})`
            : labelBase
          const key = `${cite.issue_id ?? ""}-${cite.chunk_id ?? idx}`
          return (
            <li key={key || idx}>
              {cite.url ? (
                <a href={cite.url} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ) : (
                label
              )}
              {typeof cite.score === "number" && (
                <span className="citation-score">
                  score: {cite.score.toFixed(2)}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const markdownComponents: Components = {
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  ),
  code: ({ node: _node, inline, className, children, ...props }) => {
    if (inline) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <pre className={className}>
        <code {...props}>{children}</code>
      </pre>
    )
  }
}

export function Chat(props: ChatProps) {
  const {
    title = "Chat",
    placeholder = "メッセージを入力...",
    height = "560px"
  } = props
  const { messages, input, setInput, send, loading, error, stop, reset } =
    useChat()
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      send()
    },
    [send]
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h2>{title}</h2>
        <div className="chat-actions">
          {loading ? (
            <button type="button" onClick={stop} className="btn secondary">
              停止
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              className="btn secondary"
              disabled={loading}
            >
              リセット
            </button>
          )}
        </div>
      </div>
      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="chat-empty">まだメッセージはありません</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`bubble bubble-${m.role}`}>
            <RoleLabel role={m.role} />
            <div className="content markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {m.content}
              </ReactMarkdown>
            </div>
            {m.role === "assistant" && (
              <>
                <CitationList metadata={m.metadata} />
                {typeof m.metadata?.used_docs === "number" && (
                  <div className="used-docs">
                    参照ドキュメント: {m.metadata.used_docs}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {loading && <div className="bubble loading">生成中...</div>}
      </div>
      <form onSubmit={onSubmit} className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={3}
          disabled={loading}
        />
        <div className="input-actions">
          <button
            type="submit"
            className="btn primary"
            disabled={!input.trim() || loading}
          >
            送信
          </button>
        </div>
      </form>
      {error && <div className="error-bar">{error}</div>}
    </div>
  )
}

export default Chat
