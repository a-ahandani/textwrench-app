import { AiMode } from '@shared/ai'
import { useTextStream } from './useTextStream'

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
  const {
    output,
    isStreaming,
    error,
    start: baseStart,
    cancel,
    reset
  } = useTextStream({
    defaultErrorMessage: 'Failed to stream preview',
    buildPayload: ({ text }) => ({
      selectedText: text,
      selectedPrompt: promptValue ? { value: promptValue } : undefined,
      mode
    })
  })

  const start = (): void => baseStart(selectedText)

  return { output, isStreaming, error, start, cancel, reset }
}
