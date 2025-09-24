import { useCallback, useEffect, useState } from 'react'

/**
 * Generic streaming text hook that wires up to the window.api text streaming events.
 * Provides common state (output, isStreaming, error) and control functions.
 */
export type UseTextStreamOptions<ExtraStartPayload extends object = Record<string, unknown>> = {
  /** Default error message if backend doesn't supply one */
  defaultErrorMessage?: string
  /** Build payload passed to startTextStream. Receives selectedText and optional extras */
  buildPayload: (args: { text: string } & ExtraStartPayload) => Record<string, unknown>
  /** Optional auto start trigger dependencies & text provider */
  autoStartText?: string | null | undefined
  /** When autoStartText changes and is non-empty, auto-start streaming */
  enableAutoStart?: boolean
}

export type UseTextStreamReturn = {
  output: string
  isStreaming: boolean
  error: string | null
  start: (text: string, extra?: Record<string, unknown>) => void
  cancel: () => void
  reset: () => void
}

export function useTextStream<ExtraStartPayload extends object = Record<string, unknown>>(
  options: UseTextStreamOptions<ExtraStartPayload>
): UseTextStreamReturn {
  const {
    defaultErrorMessage = 'Failed to stream text',
    buildPayload,
    autoStartText,
    enableAutoStart = false
  } = options

  const [output, setOutput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancel = useCallback(() => {
    if (!isStreaming) return
    void window.api.cancelTextStream()
    setIsStreaming(false)
  }, [isStreaming])

  const reset = useCallback(() => {
    setOutput('')
    setError(null)
  }, [])

  const start = useCallback(
    (rawText: string, extra?: Record<string, unknown>) => {
      const text = (rawText || '').trim()
      if (!text) return
      setOutput('')
      setError(null)
      setIsStreaming(true)
      // Ensure we satisfy the generic intersection type
      const payload = buildPayload({
        ...(extra as ExtraStartPayload),
        text
      } as { text: string } & ExtraStartPayload)
      void window.api.startTextStream(payload)
    },
    [buildPayload]
  )

  // Event subscriptions (duplicated pattern centralized here)
  useEffect(() => {
    const offChunk = window.api.onTextStreamChunk((data) => {
      if (!isStreaming) return
      if (data?.content) setOutput((prev) => prev + data.content)
    })
    const offDone = window.api.onTextStreamDone(() => {
      if (!isStreaming) return
      setIsStreaming(false)
    })
    const offError = window.api.onTextStreamError((d) => {
      if (!isStreaming) return
      setIsStreaming(false)
      setError(d?.error || defaultErrorMessage)
    })
    return () => {
      offChunk?.()
      offDone?.()
      offError?.()
    }
  }, [isStreaming, defaultErrorMessage])

  // Auto start behavior
  useEffect(() => {
    if (!enableAutoStart) return
    const text = (autoStartText || '').trim()
    if (text) {
      start(text)
    } else {
      // Reset if empty
      setOutput('')
      setError(null)
      setIsStreaming(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartText, enableAutoStart])

  // Cleanup on unmount if streaming
  useEffect(() => {
    return () => {
      if (isStreaming) void window.api.cancelTextStream()
    }
  }, [isStreaming])

  return { output, isStreaming, error, start, cancel, reset }
}
