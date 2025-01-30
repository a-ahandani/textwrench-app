import { Card } from '@chakra-ui/react'

export const About = () => {
  return (
    <Card.Root>
      <Card.Body>
        <Card.Title mt="2">About</Card.Title>
        <Card.Description>Version 0.1.0</Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
