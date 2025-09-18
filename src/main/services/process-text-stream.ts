import { ipcMain, webContents } from 'electron'
import { twService } from '../providers/axios'
import { IPC_EVENTS } from '../../shared/ipc-events'
import { AiMode } from '../../shared/ai'
import { store } from '../providers/store'

type StartPayload = {
  selectedText: string
  selectedPrompt?: { value: string }
  mode?: AiMode
}

// Keep a reference to the current cancel function per webContents to support cancellation
const activeRequests = new Map<number, () => void>()

export function registerTextStreamIpc(): void {
  ipcMain.handle(IPC_EVENTS.PROCESS_TEXT_STREAM_START, async (event, payload: StartPayload) => {
    const wcId = event.sender.id

    const cancelPrev = activeRequests.get(wcId)
    if (cancelPrev) {
      try {
        cancelPrev()
      } catch {
        // ignore cancellation errors
      }
      activeRequests.delete(wcId)
    }

    const wc = webContents.fromId(wcId)
    if (!wc) return

    // Resolve prompt similar to non-streaming service
    const storedPrompt =
      (store.get('selectedPrompt') as { value?: string } | undefined) || undefined
    const resolvedPrompt = payload.selectedPrompt?.value || storedPrompt?.value || ''
    const text = `${resolvedPrompt ? resolvedPrompt + ':\n\n' : ''}${payload.selectedText}`
    const mode = payload.mode || AiMode.Explain

    // Configure axios request with streaming response
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

      stream.on('data', (chunk: Buffer) => {
        buffered += chunk.toString('utf8')
        // Split by newlines to get NDJSON messages
        const lines = buffered.split('\n')
        buffered = lines.pop() || ''
        for (const line of lines) {
          const jsonLine = line.trimEnd() // remove potential \r
          if (!jsonLine) continue
          try {
            const payload = JSON.parse(jsonLine) as { content?: string; error?: string }
            if (payload.error) {
              wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: payload.error })
            } else if (payload.content) {
              wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_CHUNK, { content: payload.content })
            }
          } catch {
            // Not a JSON line; ignore
          }
        }
      })

      stream.on('end', () => {
        // Flush any leftover buffered JSON without trailing newline
        const tail = buffered.trim()
        if (tail) {
          try {
            const payload = JSON.parse(tail) as { content?: string; error?: string }
            if (payload.error) {
              wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: payload.error })
            } else if (payload.content) {
              console.log('[stream] SEND tail -> wc', wcId, 'len:', payload.content.length)
              wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_CHUNK, { content: payload.content })
            }
          } catch {
            // ignore invalid tail
          }
        }
        activeRequests.delete(wcId)
        wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_DONE)
      })

      stream.on('error', (err: Error) => {
        activeRequests.delete(wcId)
        wc.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: err.message })
      })
    } catch (err: unknown) {
      // Abort and errors will land here before stream events
      activeRequests.delete(wcId)
      const message = (err as Error)?.message
      const name = (err as { name?: string })?.name
      if (message === 'cancelled' || name === 'CanceledError') {
        // Swallow cancellation
        return
      }
      const wc2 = webContents.fromId(wcId)
      wc2?.send(IPC_EVENTS.PROCESS_TEXT_STREAM_ERROR, { error: message || 'Stream error' })
    }
  })

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
