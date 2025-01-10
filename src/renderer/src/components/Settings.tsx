import { Button, Card } from '@chakra-ui/react'

export const Settings = () => {
  return (
    <Card.Root>
      <Card.Body gap="2">
        <Card.Title mt="2">Login to your account</Card.Title>
        <Card.Description>
          This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">Login</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
  )
}
