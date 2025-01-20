import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { UserProfile } from '@shared/types/store'

const { getProfile } = window.api
const queryKey = [IPC_EVENTS.GET_PROFILE]

export const useProfile = (props) => {
  const queryClient = useQueryClient()

  const query = useQuery<UserProfile>({
    queryKey,
    queryFn: getProfile,
    ...props
  })

  return {
    ...query,
    removeQuery: () => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
