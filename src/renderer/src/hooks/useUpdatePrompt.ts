import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'

const { updatePrompt } = window.api
const mutationKey = [IPC_EVENTS.UPDATE_PROMPT]
const queryKey = [IPC_EVENTS.GET_PROMPTS]
export const useUpdatePrompt = ({
  id,
  onSuccess,
  onError
}: {
  id?: Prompt['ID']
  onSuccess?: (data: Prompt) => void
  onError?: (error) => void
}): UseMutationResult<Prompt, unknown, Partial<Prompt>, unknown> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey,
    mutationFn: (prompt: Partial<Prompt>) => updatePrompt({ ...prompt, ID: id ?? undefined }),
    onMutate: (prompt) => {
      queryClient.cancelQueries({ queryKey })
      const previousValue = queryClient.getQueryData<Prompt[]>(queryKey)
      queryClient.setQueryData(queryKey, (old: Prompt[]) =>
        old.map((item) => (item.ID == id ? { ...item, ...prompt } : item))
      )

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
