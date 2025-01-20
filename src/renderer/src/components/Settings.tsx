import { Button, Card } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from './providers/AuthProvider'

export const Settings = () => {
  const { login, logout, isLoading, isLoggedIn } = useAuth()
  const { data: profile } = useProfile({ enabled: isLoggedIn })

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
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              logout()
            }}
            bg={'red.500'}
            variant="solid"
          >
            {isLoading ? 'Loading...' : 'Logout'}
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
