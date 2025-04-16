import { Box, ButtonGroup, Card, Text, Kbd, Icon } from '@chakra-ui/react'
import { Button } from '@renderer/components/ui/Button'
import { GoPlus } from 'react-icons/go'
import { usePromptsContext } from './PromptsContext'
import { useRoute } from '@renderer/components/providers/RouteProvider'
import { ACTION_DEFAULT_SHORTCUTS, ACTIONS } from '@shared/constants'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from '@renderer/components/providers/AuthProvider'
import { GoInfo } from 'react-icons/go'

export const PromptHead = (): JSX.Element => {
  const { setEditingId } = usePromptsContext()
  const { setCurrentRoute } = useRoute()
  const { isLoggedIn } = useAuth()
  const { data: profile } = useProfile({ enabled: isLoggedIn })

  const shortcuts =
    profile?.shortcuts?.[ACTIONS.CORRECT_TEXT] || ACTION_DEFAULT_SHORTCUTS[ACTIONS.CORRECT_TEXT]

  return (
    <>
      <Card.Root mb={1} variant="subtle" flex={1}>
        <Card.Body pb={4} flexDirection="row" justifyContent="space-between">
          <Box>
            <Card.Title>My Prompts</Card.Title>{' '}
            <Card.Description as="div">
              Create your own custom prompts to use with the AI.
            </Card.Description>
          </Box>
          <ButtonGroup size="xs" variant="subtle" attached>
            <Button
              onClick={() => setCurrentRoute('templates')}
              variant="subtle"
              colorPalette="green"
            >
              Templates
            </Button>
            <Button
              onClick={() => {
                setEditingId('new')
              }}
              colorPalette="green"
              variant="solid"
            >
              <GoPlus /> Create new prompt
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card.Root>
      <Card.Root mb={2} variant="subtle" flex={1}>
        <Card.Body py={1} flexDirection="row" alignItems="center">
          <Icon size="sm" mr={1}>
            <GoInfo />
          </Icon>
          <Text fontSize="xs" fontWeight="light">
            The default prompt will be used when you use instant fix on selected text{' '}
            <Box ml={3} display="inline-flex">
              {shortcuts.map((key) => {
                return (
                  <Kbd ml="-1" mr="2" variant="raised" size="sm" key={key}>
                    {key}
                  </Kbd>
                )
              })}
            </Box>
          </Text>
        </Card.Body>
      </Card.Root>
    </>
  )
}
