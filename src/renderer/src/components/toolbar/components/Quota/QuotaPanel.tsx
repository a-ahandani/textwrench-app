import React from 'react'
import { Box, Button, Text, VStack } from '@chakra-ui/react'
import { useUsageLimit } from '../../../providers/useUsageLimit'
import { PanelLayout } from '../PanelLayout/PanelLayout'

export const QuotaPanel: React.FC = () => {
  const { info } = useUsageLimit()

  if (!info) {
    return (
      <PanelLayout title="Usage">
        <Text fontSize="sm" opacity={0.6} py={2}>
          Loading usage info…
        </Text>
      </PanelLayout>
    )
  }

  const percent =
    info.limit > 0 ? Math.min(100, Math.round((info.actionCount / info.limit) * 100)) : 100

  // Compute next UTC midnight reset time remaining (client-side approximation)
  const now = new Date()
  const nextUtcMidnight = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)
  )
  const msRemaining = nextUtcMidnight.getTime() - now.getTime()
  const hours = Math.floor(msRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))
  const resetIn = `${hours}h ${minutes}m`

  return (
    <PanelLayout title="Daily Limit Reached">
      <VStack align="stretch" gap={2} fontSize="xs" pt={1}>
        <Text>
          You have used <b>{info.actionCount}</b> of <b>{info.limit}</b> free AI actions today.
        </Text>
        <Text>
          Your free quota resets daily at <b>00:00 UTC</b> (in about {resetIn}).
        </Text>
        <Text>
          Upgrade to <b>Pro</b> for unlimited usage, custom prompts and faster responses.
        </Text>
        <Box
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          h="6px"
          bg="gray.300"
          borderRadius="sm"
          overflow="hidden"
        >
          <Box h="100%" w={`${percent}%`} bg="orange.400" transition="width 200ms" />
        </Box>
        <Button
          size="xs"
          colorPalette="orange"
          alignSelf="flex-start"
          onClick={() => {
            window.api.login?.()
          }}
        >
          Upgrade
        </Button>
      </VStack>
    </PanelLayout>
  )
}
