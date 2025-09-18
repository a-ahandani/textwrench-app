import { useCallback, useEffect, useState } from 'react'
import { AiMode } from '@shared/ai'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { useEventSubscription } from './useEventSubscription'

type UseExplainTextReturn = {
  output: string
  isStreaming: boolean
  error: string | null
  start: (overrideText?: string) => void
  cancel: () => void
  reset: () => void
}

export const useExplainText = (): UseExplainTextReturn => {
  const { data: selected } = useSelectedText()
  const selectedText = selected?.text || ''

  const [output, setOutput] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
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
    (overrideText?: string) => {
      const text = (overrideText ?? selectedText).trim()
      if (!text) return

      setOutput('')
      setError(null)
      setIsStreaming(true)

      void window.api.startTextStream({ selectedText: text, mode: AiMode.Explain })
    },
    [selectedText]
  )

  useEventSubscription<{ content?: string }>({
    eventName: 'onTextStreamChunk',
    callback: (data) => {
      if (!isStreaming) return
      if (data?.content) {
        setOutput((prev) => prev + data.content)
      }
    },
    dependencies: [isStreaming]
  })

  useEventSubscription<void>({
    eventName: 'onTextStreamDone',
    callback: () => {
      if (!isStreaming) return
      setIsStreaming(false)
    },
    dependencies: [isStreaming]
  })

  useEventSubscription<{ error: string }>({
    eventName: 'onTextStreamError',
    callback: (d) => {
      if (!isStreaming) return
      setIsStreaming(false)
      setError(d?.error || 'Failed to stream explanation')
    },
    dependencies: [isStreaming]
  })

  useEffect(() => {
    if (selectedText.trim()) {
      start(selectedText)
    } else {
      setOutput('')
      setError(null)
      setIsStreaming(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedText])

  useEffect(() => {
    return () => {
      if (isStreaming) {
        void window.api.cancelTextStream()
      }
    }
  }, [isStreaming])

  return { output, isStreaming, error, start, cancel, reset }
}
