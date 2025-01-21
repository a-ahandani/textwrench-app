import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'

const { createPrompt } = window.api
const mutationKey = [IPC_EVENTS.CREATE_PROMPT]
const queryKey = [IPC_EVENTS.GET_PROMPTS]
export const useCreatePrompt = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: Prompt) => void
  onError?: (error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey,
    mutationFn: (prompt: Partial<Prompt>) => createPrompt({ ...prompt }),
    onMutate: (prompt) => {
      queryClient.cancelQueries({ queryKey })
      const previousValue = queryClient.getQueryData<Prompt[]>(queryKey)
      queryClient.setQueryData(queryKey, (old: Prompt[]) => [{ ...prompt, ID: 'temp_id' }, ...old])

      return { previousValue }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey })
      onSuccess?.(data)
    },
    onError: (err, newPrompt, context) => {
      queryClient.setQueryData(queryKey, context?.previousValue)
      queryClient.invalidateQueries({ queryKey })
      onError?.(err)
    }
  })
}
