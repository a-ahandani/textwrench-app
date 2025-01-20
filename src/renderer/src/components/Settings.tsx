import { Button, Card, ProgressRoot } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from './providers/AuthProvider'
import { ProgressBar } from './ui/Progress'

export const Settings = () => {
  const { login, logout, isLoading: isLoggingIn, isLoggedIn } = useAuth()
  const { data: profile, isLoading, isFetched } = useProfile({ enabled: isLoggedIn })

  return (
    <Card.Root>
      <Card.Body>
        {isLoading && (
          <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
            <ProgressBar />
          </ProgressRoot>
        )}
        <Card.Title mt="2">
          {isLoggedIn && isFetched ? profile?.name : 'Login to your account'}
        </Card.Title>
        <Card.Description>
          Hello {isLoggedIn && isFetched ? profile?.name : 'Guest'}
        </Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {!isLoggedIn ? (
          <Button
            onClick={() => {
              login()
            }}
            variant="outline"
          >
            {isLoggingIn ? 'Loading...' : 'Login'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              logout()
            }}
            bg={'red.500'}
            variant="solid"
          >
            {isLoggingIn ? 'Loading...' : 'Logout'}
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
