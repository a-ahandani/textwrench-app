import { useMutation, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Shortcuts } from '@shared/types/store'

const { updateShortcuts } = window.api
const mutationKey = [IPC_EVENTS.UPDATE_PROMPT]
const queryKey = [IPC_EVENTS.GET_PROFILE]
export const useUpdateShortcuts = ({
  onSuccess,
  onError
}: {
  onSuccess?: (data: Shortcuts) => void
  onError?: (error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey,
    mutationFn: (shortcuts: Partial<Shortcuts>) => updateShortcuts(shortcuts),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey })
      onSuccess?.(data)
    },
    onError: (err) => {
      onError?.(err)
    }
  })
}
