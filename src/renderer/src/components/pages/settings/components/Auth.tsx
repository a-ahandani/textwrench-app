import { Card, IconButton, ProgressRoot, ButtonGroup } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from '../../../providers/AuthProvider'
import { ProgressBar } from '../../../ui/Progress'
import { Button } from '@renderer/components/ui/Button'
import { labels } from '@shared/constants'
import { GoX } from 'react-icons/go'

export const Auth = () => {
  const { login, logout, isLoading: isLoggingIn, isLoggedIn, setIsLoading } = useAuth()
  const { data: profile, isLoading, isFetched } = useProfile({ enabled: isLoggedIn })
  const isPremium = profile?.user_type !== 'free'

  return (
    <Card.Root>
      <Card.Body>
        {isLoading && (
          <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
            <ProgressBar />
          </ProgressRoot>
        )}
        <Card.Title mt="2">
          {isLoggedIn && isFetched ? `Hello, ${profile?.name}` : 'Login to your account'}
        </Card.Title>
        {isLoggedIn ? (
          <Card.Description>
            You are using {isPremium ? `active` : `free`} version of the {labels.app}
          </Card.Description>
        ) : (
          <Card.Description>Please login to access the premium features</Card.Description>
        )}
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        {!isLoggedIn ? (
          <ButtonGroup size="sm" attached>
            <Button
              variant="subtle"
              onClick={() => {
                login()
              }}
              loading={isLoggingIn}
            >
              Login
            </Button>
            {isLoggingIn && (
              <IconButton
                variant="subtle"
                onClick={() => {
                  setIsLoading(false)
                }}
              >
                <GoX />
              </IconButton>
            )}
          </ButtonGroup>
        ) : (
          <Button
            onClick={() => {
              logout()
            }}
            bg={'red.500'}
            variant="solid"
            loading={isLoggingIn}
          >
            Logout
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
