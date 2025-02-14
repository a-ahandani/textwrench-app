import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { UserProfile } from '@shared/types/store'
import { PLATFORMS } from '@shared/constants'

const { getProfile } = window.api
const queryKey = [IPC_EVENTS.GET_PROFILE]

const platform = window?.electron?.process?.platform

export const useProfile = (props) => {
  const queryClient = useQueryClient()

  const query = useQuery<UserProfile>({
    queryKey,
    queryFn: getProfile,
    select: (data) => {
      if (!data?.shortcuts) return data
      const shortcuts = data?.shortcuts?.[PLATFORMS[platform]]
      const shortcutsTransformed = {}
      for (const key in shortcuts) {
        shortcutsTransformed[key] = shortcuts[key].split('+')
      }
      return {
        ...data,
        shortcuts: shortcutsTransformed
      }
    },
    ...props
  })

  return {
    ...query,
    removeQuery: () => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
