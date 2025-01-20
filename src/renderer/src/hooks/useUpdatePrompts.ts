import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'

const { updatePrompt } = window.api
const mutationKey = [IPC_EVENTS.UPDATE_PROMPT]

export const useUpdatePrompts = ({
  id,
  onSuccess,
  onError
}: {
  id: Prompt['ID']
  onSuccess?: (data: Prompt) => void
  onError?: (error: unknown) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation<Prompt, unknown, Partial<Prompt>>({
    mutationKey,
    mutationFn: (prompt) => updatePrompt({ ...prompt, ID: id }),
    onSuccess: (data) => {
      // e.g. queryClient.invalidateQueries(queryKey)
      // or queryClient.setQueryData(queryKey, data)
      queryClient.invalidateQueries({ queryKey: [IPC_EVENTS.GET_PROMPTS] })
      onSuccess?.(data)
    },
    onError
  })
}
