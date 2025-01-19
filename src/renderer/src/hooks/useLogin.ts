import { IPC_EVENTS } from '@shared/ipc-events'
import { useQuery } from '@tanstack/react-query'

export const useLogin = () => {
  const { login } = window.api
  return useQuery({
    queryKey: [IPC_EVENTS.LOGIN],
    queryFn: login
  })
}
