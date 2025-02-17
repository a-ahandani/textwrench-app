import { Card } from '@chakra-ui/react'

export const PromptHead = () => {
  return (
    <Card.Root variant="subtle">
      <Card.Body>
        <Card.Title mt="2">Prompts</Card.Title>
        <Card.Description>
          List of all the prompts you have created. You can also create new prompts.
        </Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
