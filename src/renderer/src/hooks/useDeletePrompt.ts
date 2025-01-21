import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'

const { deletePrompt } = window.api
const mutationKey = [IPC_EVENTS.DELETE_PROMPT]
const queryKey = [IPC_EVENTS.GET_PROMPTS]
export const useDeletePrompt = ({
  id,
  onSuccess,
  onError
}: {
  id?: Prompt['ID']
  onSuccess?: () => void
  onError?: (error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey,
    mutationFn: () => deletePrompt({ ID: id }),
    onMutate: () => {
      queryClient.cancelQueries({ queryKey })
      const previousValue = queryClient.getQueryData<Prompt[]>(queryKey)
      queryClient.setQueryData(queryKey, (old: Prompt[]) => old.filter((item) => item.ID != id))

      return { previousValue }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      onSuccess?.()
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousValue)
      queryClient.invalidateQueries({ queryKey })
      onError?.(err)
    }
  })
}
