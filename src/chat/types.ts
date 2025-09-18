export type ChatRole = "user" | "assistant" | "system" | "error"

export interface CitationMeta {
  issue_id?: string | number
  chunk_id?: string | number
  updated_on?: string
  url?: string
  score?: number
  title?: string
}

export interface ChatMetadata {
  citations?: CitationMeta[]
  used_docs?: number
  [key: string]: unknown
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: number
  metadata?: ChatMetadata
}

export interface SendMessageOptions {
  abortController?: AbortController
  context?: Record<string, unknown>
}

export interface UseChatOptions {
  /** APIの相対 or 絶対URL 例: /api/chat */
  endpoint?: string
  /** 追加で送るシステムプロンプト */
  systemPrompt?: string
  /** 直近N件のみ送るなどのトリミング */
  historyLimit?: number
}
