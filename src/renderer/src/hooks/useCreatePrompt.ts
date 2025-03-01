import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'

const { createPrompt } = window.api
const mutationKey = [IPC_EVENTS.CREATE_PROMPT]
const queryKey = [IPC_EVENTS.GET_PROMPTS]

type useCreatePromptProps = {
  onSuccess?: (data: Prompt) => void
  onError?: (error) => void
}
type useCreatePromptReturn = UseMutationResult<Prompt, unknown, Partial<Prompt>, unknown>
export const useCreatePrompt = ({
  onSuccess,
  onError
}: useCreatePromptProps): useCreatePromptReturn => {
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
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousValue)
      queryClient.invalidateQueries({ queryKey })
      onError?.(err)
    }
  })
}
