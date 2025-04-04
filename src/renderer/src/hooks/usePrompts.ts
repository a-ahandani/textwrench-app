import { useQuery, useQueryClient } from '@tanstack/react-query'
import { IPC_EVENTS } from '@shared/ipc-events'
import { Prompt } from '@shared/types/store'
import { useAuth } from '@renderer/components/providers/AuthProvider'

const { getPrompts } = window.api
const queryKey = [IPC_EVENTS.GET_PROMPTS]

type usePromptsProps = { term?: string; id?: Prompt['ID'] }
type usePromptsReturn = ReturnType<typeof useQuery<Prompt[]>> & { removeQuery: () => void }

export const usePrompts = (props?: usePromptsProps): usePromptsReturn => {
  const { term, id } = props || {}

  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery<Prompt[]>({
    queryKey,
    queryFn: getPrompts,
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
    }
  })

  return {
    ...query,
    removeQuery: (): void => {
      queryClient.resetQueries({ queryKey, exact: true })
    }
  }
}
