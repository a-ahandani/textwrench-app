import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'

const { processText } = window.api
const queryKeyBase = [IPC_EVENTS.PROCESS_TEXT]

export type ProcessTextPayload = {
  selectedText: string
  selectedPrompt: { value: string }
}
type useProcessTextProps = {
  payload: ProcessTextPayload
  onSuccess?: (data) => void
  onError?: (error) => void
}
type useProcessTextReturn = UseQueryResult<string, unknown>

export const useProcessText = ({ payload }: useProcessTextProps): useProcessTextReturn => {
  const queryKey = [...queryKeyBase, `${payload.selectedText}-${payload.selectedPrompt.value}`]

  return useQuery({
    queryKey,
    staleTime: 1000 * 60 * 5,
    queryFn: () => processText(payload),
    enabled: !!payload
  })
}
