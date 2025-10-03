import { useQuery } from '@tanstack/react-query'

export type UsageStats = {
  today: number
  limit: number
  remaining: number
}

const queryKey = ['usage-stats'] as const

export const useUsageStats = (): ReturnType<typeof useQuery<UsageStats>> => {
  return useQuery<UsageStats>({
    queryKey,
    queryFn: async () => {
      const data = (await window.api.getUsageStats()) as UsageStats
      return data
    },
    staleTime: 30_000,
    refetchInterval: 60_000
  })
}
