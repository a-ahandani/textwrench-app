import { useCallback, useEffect, useState } from 'react'
import { AiMode } from '@shared/ai'
import { useEventSubscription } from './useEventSubscription'

type UsePromptPreviewArgs = {
  selectedText: string
  promptValue?: string
  mode?: AiMode
}

type UsePromptPreviewReturn = {
  output: string
  isStreaming: boolean
  error: string | null
  start: () => void
  cancel: () => void
  reset: () => void
}

export const usePromptPreview = ({
  selectedText,
  promptValue,
  mode = AiMode.Improve
}: UsePromptPreviewArgs): UsePromptPreviewReturn => {
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

  const start = useCallback(() => {
    const text = (selectedText || '').trim()
    if (!text) return

    setOutput('')
    setError(null)
    setIsStreaming(true)

    void window.api.startTextStream({
      selectedText: text,
      selectedPrompt: promptValue ? { value: promptValue } : undefined,
      mode
    })
  }, [mode, promptValue, selectedText])

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
      setError(d?.error || 'Failed to stream preview')
    },
    dependencies: [isStreaming]
  })

  useEffect(() => {
    return () => {
      if (isStreaming) void window.api.cancelTextStream()
    }
  }, [isStreaming])

  return { output, isStreaming, error, start, cancel, reset }
}
