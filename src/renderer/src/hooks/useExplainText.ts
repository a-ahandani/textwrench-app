import { AiMode } from '@shared/ai'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { useTextStream } from './useTextStream'

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

  const {
    output,
    isStreaming,
    error,
    start: baseStart,
    cancel,
    reset
  } = useTextStream({
    defaultErrorMessage: 'Failed to stream explanation',
    buildPayload: ({ text }) => ({ selectedText: text, mode: AiMode.Explain }),
    autoStartText: selectedText,
    enableAutoStart: true
  })

  const start = (overrideText?: string): void => {
    baseStart(overrideText ?? selectedText)
  }

  return { output, isStreaming, error, start, cancel, reset }
}
