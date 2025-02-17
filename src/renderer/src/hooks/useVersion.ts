import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'

type Version = {
  tag_name: string
  body: string
}
const { download, getVersion } = window.api
const queryKey = [IPC_EVENTS.GET_VERSION]

export const useVersion = () => {
  const queryClient = useQueryClient()

  const query = useQuery<Version>({
    queryKey,
    queryFn: getVersion
  })

  return {
    ...query,
    download,
    removeQuery: () => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
