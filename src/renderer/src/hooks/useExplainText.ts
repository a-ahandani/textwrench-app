import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { AiMode } from '@shared/ai'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'

const { processText } = window.api
const mutationKeyBase = [IPC_EVENTS.PROCESS_TEXT, AiMode.Explain]

export type ExplainTextPayload = {
  selectedText: string
}

export const useExplainText = (): UseMutationResult<
  string,
  unknown,
  ExplainTextPayload,
  unknown
> => {
  const { data } = useSelectedText()
  return useMutation({
    mutationKey: mutationKeyBase,
    mutationFn: async ({ selectedText }) => {
      const result = (await processText({ selectedText, mode: AiMode.Explain })) as string
      return result
    },
    // Provide selected text by default if caller doesn't supply variables
    onMutate: (variables) => {
      if (!variables?.selectedText && data?.text) {
        return { selectedText: data.text }
      }
      return variables
    }
  })
}
