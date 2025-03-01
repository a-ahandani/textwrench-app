import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { UserProfile } from '@shared/types/store'
import { PLATFORMS } from '@shared/constants'

const { getProfile } = window.api
const queryKey = [IPC_EVENTS.GET_PROFILE]

const platform = window?.electron?.process?.platform

type useProfileReturn = ReturnType<typeof useQuery<UserProfile>> & { removeQuery: () => void }
export const useProfile = (props): useProfileReturn => {
  const queryClient = useQueryClient()

  const query = useQuery<UserProfile>({
    queryKey,
    queryFn: getProfile,
    select: (data) => {
      if (!data?.shortcuts) return data
      const shortcuts = data?.shortcuts?.[PLATFORMS[platform]]
      const shortcutsTransformed = {}
      for (const key in shortcuts) {
        if (shortcuts?.[key]?.length) {
          shortcutsTransformed[key] = shortcuts[key].split('+')
        } else {
          shortcutsTransformed[key] = null
        }
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
    removeQuery: (): void => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
