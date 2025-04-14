import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Category } from '@shared/types/store'
import { useAuth } from '@renderer/components/providers/AuthProvider'

const { getCategories } = window.api
const queryKey = [IPC_EVENTS.GET_CATEGORIES]

type useCategoriesReturn = ReturnType<typeof useQuery<Category[]>> & { removeQuery: () => void }

export const useCategories = (): useCategoriesReturn => {
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery<Category[]>({
    queryKey,
    queryFn: getCategories,
    enabled: isLoggedIn
  })

  return {
    ...query,
    removeQuery: (): void => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
