import { BrowserWindow } from 'electron'
import { IPC_EVENTS } from '@shared/ipc-events'
import { getToolbarWindow } from '../../windows/toolbar'
import { store } from '../../providers/store'
import { AiMode } from '@shared/ai'
import { UsageLimitPayload, ProcessTextPayload } from './types'

/**
 * Broadcasts usage limit information to all windows
 */
export function broadcastLimit(payload: UsageLimitPayload): void {
  try {
    getToolbarWindow()?.webContents.send(IPC_EVENTS.USAGE_LIMIT_REACHED, payload)
    BrowserWindow.getAllWindows().forEach((w) => {
      try {
        w.webContents.send(IPC_EVENTS.USAGE_LIMIT_REACHED, payload)
      } catch {
        /* ignore */
      }
    })
  } catch {
    /* ignore */
  }
}

/**
 * Resolves the prompt from payload or store, formats user prompt text
 */
export async function resolvePromptText(payload: ProcessTextPayload): Promise<string> {
  const storedPrompt = (await store.get('selectedPrompt')) as { value?: string } | undefined
  const resolvedPrompt = payload.selectedPrompt?.value || storedPrompt?.value || ''

  if (resolvedPrompt) {
    return `${resolvedPrompt}:\n\n${payload.selectedText}`
  }
  return payload.selectedText
}

/**
 * Gets the AI mode with fallback to default
 */
export function resolveMode(mode?: AiMode, defaultMode: AiMode = AiMode.Improve): AiMode {
  return mode || defaultMode
}

/**
 * Creates a standardized usage limit payload from API response data
 */
export function createUsageLimitPayload(data: {
  allowed?: boolean
  limit?: number
  remaining?: number
  actionCount?: number
  plan?: string
}): UsageLimitPayload {
  return {
    allowed: data.allowed ?? false,
    limit: data.limit ?? 0,
    remaining: data.remaining ?? 0,
    actionCount: data.actionCount ?? 0,
    plan: data.plan || 'free'
  }
}
