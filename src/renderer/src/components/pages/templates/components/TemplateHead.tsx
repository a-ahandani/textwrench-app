import { Box, Button, ButtonGroup, Card } from '@chakra-ui/react'
import { useRoute } from '@renderer/components/providers/RouteProvider'
import { GoPlus } from 'react-icons/go'
import { usePromptsContext } from '../../prompts/components/PromptsContext'

export const TemplateHead = (): JSX.Element => {
  const { setEditingId } = usePromptsContext()
  const { setCurrentRoute } = useRoute()

  return (
    <Card.Root mb={2} variant="subtle" flex={1}>
      <Card.Body flexDirection="row" justifyContent="space-between">
        <Box>
          <Card.Title>Templates</Card.Title>
          <Card.Description as="div">
            Use templates to create your own custom prompts.
          </Card.Description>
        </Box>
        <ButtonGroup size="xs" variant="subtle" attached>
          <Button onClick={() => setCurrentRoute('prompts')} variant="subtle" colorPalette="green">
            Prompts
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
