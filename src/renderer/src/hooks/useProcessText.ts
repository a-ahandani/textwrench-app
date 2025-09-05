import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'

const { processText } = window.api
const mutationKeyBase = [IPC_EVENTS.PROCESS_TEXT]

export type ProcessTextPayload = {
  selectedText: string
  selectedPrompt?: { value: string }
}
type useProcessTextProps = {
  onSuccess?: (data: string) => void
  onError?: (error: unknown) => void
}
type useProcessTextReturn = UseMutationResult<string, unknown, ProcessTextPayload, unknown>

export const useProcessText = ({
  onSuccess,
  onError
}: useProcessTextProps = {}): useProcessTextReturn => {
  return useMutation({
    mutationKey: mutationKeyBase,
    mutationFn: (payload: ProcessTextPayload) => processText(payload),
    onSuccess,
    onError
  })
}
