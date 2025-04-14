import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Template } from '@shared/types/store'
import { useAuth } from '@renderer/components/providers/AuthProvider'

const { getTemplates } = window.api
const queryKey = [IPC_EVENTS.GET_TEMPLATES]

type useTemplatesProps = { term?: string; id?: Template['ID'] }
type useTemplatesReturn = ReturnType<typeof useQuery<Template[]>> & { removeQuery: () => void }

export const useTemplates = (props?: useTemplatesProps): useTemplatesReturn => {
  const { term, id } = props || {}

  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery<Template[]>({
    queryKey,
    queryFn: getTemplates,
    enabled: isLoggedIn,
    select: (data) => {
      return data
        .map((item) => ({ ...item, ID: String(item.ID) }))
        .filter((item) => {
          const matchesTerm = term
            ? item.label?.toLowerCase().includes(term.toLowerCase()) ||
              item.value?.toLowerCase().includes(term.toLowerCase())
            : true

          const matchesId = id ? item.ID === id : true

          return matchesTerm && matchesId
        })
        .sort((a, b) => {
          if (a.rate && b.rate) {
            return b.rate - a.rate
          }
          return 0
        })
    }
  })

  return {
    ...query,
    removeQuery: (): void => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
