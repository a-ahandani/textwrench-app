import { Button, Card } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'

export const Settings = () => {
  const { login, logout, profile, isLoggedIn } = useProfile()

  return (
    <Card.Root>
      <Card.Body>
        <Card.Title mt="2">{isLoggedIn ? profile?.name : 'Login to your account'}</Card.Title>
        <Card.Description>Hello {isLoggedIn ? profile?.name : 'Guest'}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {!isLoggedIn ? (
          <Button
            onClick={() => {
              login()
            }}
            variant="outline"
          >
            Login
          </Button>
        ) : (
          <Button
            onClick={() => {
              logout()
            }}
            bg={'red.500'}
            variant="solid"
          >
            Logout
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
