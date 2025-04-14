import { Box, ButtonGroup, Card } from '@chakra-ui/react'
import { Button } from '@renderer/components/ui/Button'
import { GoPlus } from 'react-icons/go'
import { usePromptsContext } from './PromptsContext'
import { useRoute } from '@renderer/components/providers/RouteProvider'

export const PromptHead = (): JSX.Element => {
  const { setEditingId } = usePromptsContext()
  const { setCurrentRoute } = useRoute()

  return (
    <Card.Root my={2} variant="subtle" flex={1}>
      <Card.Body flexDirection="row" justifyContent="space-between">
        <Box>
          <Card.Title fontSize="sm">My Prompts</Card.Title>{' '}
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
  )
}
