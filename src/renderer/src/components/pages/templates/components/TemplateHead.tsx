import { Box, Card } from '@chakra-ui/react'

export const TemplateHead = (): JSX.Element => {
  return (
    <Card.Root mb={2} variant="subtle" flex={1}>
      <Card.Body flexDirection="row" justifyContent="space-between">
        <Box>
          <Card.Title>Templates</Card.Title>
          <Card.Description as="div">
            Use templates to create your own custom prompts to use with the AI.
          </Card.Description>
        </Box>
      </Card.Body>
    </Card.Root>
  )
}
