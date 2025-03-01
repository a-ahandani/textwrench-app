import { IPC_EVENTS } from '@shared/ipc-events'
import { useQuery } from '@tanstack/react-query'

type useLoginReturn = ReturnType<typeof useQuery>
export const useLogin = (): useLoginReturn => {
  const { login } = window.api
  return useQuery({
    queryKey: [IPC_EVENTS.LOGIN],
    queryFn: login
  })
}
