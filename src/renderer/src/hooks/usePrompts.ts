import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'
import { useAuth } from '@renderer/components/providers/AuthProvider'

const { getPrompts } = window.api
const queryKey = [IPC_EVENTS.GET_PROMPTS]

export const usePrompts = () => {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery<Prompt[]>({
    queryKey,
    queryFn: getPrompts,
    enabled: isLoggedIn
  })

  return {
    ...query,
    removeQuery: () => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
