import { AiMode } from '@shared/ai'

export interface UsageLimitPayload {
  allowed: boolean
  remaining: number
  limit: number
  actionCount: number
  plan: string
}

export interface ProcessTextResponse {
  processedText?: string
  allowed?: boolean
  plan?: string
  actionCount?: number
  limit?: number
  remaining?: number
}

export interface ProcessTextPayload {
  selectedText: string
  selectedPrompt?: { value: string }
  mode?: AiMode
}

export interface StreamPayload {
  content?: string
  error?: string
  allowed?: boolean
  final?: boolean
  limit?: number
  remaining?: number
  actionCount?: number
  plan?: string
}
