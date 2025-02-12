import { Card } from '@chakra-ui/react'
import { useStore } from '@renderer/hooks/useStore'

export const About = () => {
  const { value: version } = useStore<string>({
    key: 'appVersion'
  })

  return (
    <Card.Root>
      <Card.Body>
        <Card.Title mt="2">About</Card.Title>
        <Card.Description>You are using this version: {version}</Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
