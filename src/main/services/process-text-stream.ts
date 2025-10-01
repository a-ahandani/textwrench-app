import { ipcMain, webContents } from 'electron'
import { twService } from '../providers/axios'
import { IPC_EVENTS } from '../../shared/ipc-events'
import { AiMode } from '../../shared/ai'
import { ProcessTextPayload, StreamPayload } from './shared/types'
import {
  broadcastLimit,
  resolvePromptText,
  resolveMode,
  createUsageLimitPayload
} from './shared/utils'

// Streaming now relies on server-provided initial allowance line and optional final stats line.
// We no longer perform client-side pre-check or increment usage; backend handles gating & debounce.

const activeRequests = new Map<number, () => void>()

export function registerTextStreamIpc(): void {
  ipcMain.handle(
    IPC_EVENTS.PROCESS_TEXT_STREAM_START,
    async (event, payload: ProcessTextPayload) => {
      const wcId = event.sender.id

      const cancelPrev = activeRequests.get(wcId)
      if (cancelPrev) {
        try {
          cancelPrev()
        } catch {
          /* ignore */
        }
        activeRequests.delete(wcId)
      }

      const wc = webContents.fromId(wcId)
      if (!wc) return

      const text = await resolvePromptText(payload)
      const mode = resolveMode(payload.mode, AiMode.Explain)

      const controller = new AbortController()
      activeRequests.set(wcId, () => controller.abort('cancelled'))

      try {
        const response = await twService.post(
          '/protected/process-text/stream',
          { text, mode },
          {
            responseType: 'stream',
            signal: controller.signal,
            headers: { Accept: 'application/x-ndjson' }
          }
        )

        const stream = response.data as NodeJS.ReadableStream
        let buffered = ''
        let allowedKnown = false
        let deniedEmitted = false

        stream.on('data', (chunk: Buffer) => {
          buffered += chunk.toString('utf8')
          const lines = buffered.split('\n')
          buffered = lines.pop() || ''
          for (const line of lines) {
            const jsonLine = line.trimEnd()
            if (!jsonLine) continue
            try {
              const payload = JSON.parse(jsonLine) as StreamPayload
              // Initial allowance metadata (no content field) or final stats lines
              if (typeof payload.allowed === 'boolean' && !allowedKnown) {
                allowedKnown = true
                if (payload.allowed === false) {
                  deniedEmitted = true
                  broadcastLimit(createUsageLimitPayload(payload))
                  // Stop processing further data; server shouldn't send content after denial
                  // Attempt to close the underlying stream (Node Readable)
                  const anyStream = stream as unknown as { destroy?: () => void }
                  anyStream.destroy?.()
                  return
                }
              }
              if (payload.error) {
                wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: payload.error })
              } else if (payload.content) {
                wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_CHUNK, { content: payload.content })
              }
              // final stats line is ignored beyond potential allowed flag already processed
            } catch {
              // ignore malformed line
            }
          }
        })

        stream.on('end', () => {
          activeRequests.delete(wcId)
          if (!deniedEmitted) {
            wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_DONE)
          }
        })

        stream.on('error', (err: Error) => {
          activeRequests.delete(wcId)
          if (!deniedEmitted) {
            wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: err.message })
          }
        })
      } catch (err: unknown) {
        activeRequests.delete(wcId)
        const message = (err as Error)?.message
        const name = (err as { name?: string })?.name
        if (message === 'cancelled' || name === 'CanceledError') return
        const wc2 = webContents.fromId(wcId)
        wc2?.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: message || 'Stream error' })
      }
    }
  )

  ipcMain.handle(IPC_EVENTS.PROCESS_TEXT_STREAM_CANCEL, async (event) => {
    const wcId = event.sender.id
    const cancel = activeRequests.get(wcId)
    if (cancel) {
      try {
        cancel()
      } finally {
        activeRequests.delete(wcId)
      }
    }
  })
}
