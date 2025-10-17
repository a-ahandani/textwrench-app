import { Flex, Text, Progress, HStack, IconButton } from '@chakra-ui/react'
import { IoReload } from 'react-icons/io5'
import { SettingCard } from './SettingCard'
import { useUsageStats } from '@renderer/hooks/useUsageStats'

export const UsageStatsPanel: React.FC = () => {
  const { data, isLoading, error, refetch, isFetching } = useUsageStats()

  if (isLoading)
    return (
      <Text fontSize="sm" mt={4}>
        Loading usage…
      </Text>
    )
  if (error || !data) return null

  const ratio = data.limit > 0 ? data.today / data.limit : 0
  let rangeBg: string
  if (ratio >= 1) rangeBg = 'red.500'
  else if (ratio >= 0.9) rangeBg = 'orange.400'
  else if (ratio >= 0.75) rangeBg = 'yellow.400'
  else rangeBg = 'blue.400'
  const max = data.limit > 0 ? data.limit : 1
  const value = data.limit > 0 ? Math.min(data.today, data.limit) : 0

  return (
    <SettingCard>
      <SettingCard.Body>
        <Flex justify="space-between" align="center" mb={2}>
          <Text fontSize="sm" fontWeight="semibold">
            Daily Usage
          </Text>
          <IconButton size={'2xs'} variant={'ghost'} onClick={() => refetch()} loading={isFetching}>
            <IoReload />
          </IconButton>
        </Flex>
        <Progress.Root value={value} max={max} mb={3}>
          <HStack>
            <Progress.Label>
              Today: {data.today} / {data.limit}{' '}
              {data.limit > 0 ? `(Remaining ${data.remaining})` : ''}
            </Progress.Label>
            <Progress.Track flex="1">
              <Progress.Range bg={rangeBg} />
            </Progress.Track>
            <Progress.ValueText>{Math.round(ratio * 100)}%</Progress.ValueText>
          </HStack>
        </Progress.Root>
      </SettingCard.Body>
    </SettingCard>
  )
}
