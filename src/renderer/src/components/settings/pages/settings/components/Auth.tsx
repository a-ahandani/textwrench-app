import { IconButton, ProgressRoot, ButtonGroup } from '@chakra-ui/react'
import { SettingCard } from './SettingCard'
import { useProfile } from '@renderer/hooks/useProfile'

import { Button } from '@renderer/components/ui/Button'
import { labels } from '@shared/constants'
import { GoX } from 'react-icons/go'

import { FC } from 'react'
import { ProgressBar } from '@renderer/components/ui/Progress'
import { useAuth } from '@renderer/components/providers/AuthProvider'

export const Auth: FC = () => {
  const { login, logout, isLoading: isLoggingIn, isLoggedIn, setIsLoading } = useAuth()
  const { data: profile, isLoading } = useProfile({ enabled: isLoggedIn })
  const isPremium = profile?.user_type !== 'free'

  return (
    <SettingCard>
      <SettingCard.Body>
        {isLoading && (
          <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
            <ProgressBar />
          </ProgressRoot>
        )}
        <SettingCard.Title mt="2">
          {isLoggedIn && profile?.name ? `Hello, ${profile?.name}` : 'Login to your account'}
        </SettingCard.Title>
        {isLoggedIn ? (
          <SettingCard.Description>
            You are using {isPremium ? `active` : `free`} version of the {labels.app}
          </SettingCard.Description>
        ) : (
          <SettingCard.Description>
            Please login to access the premium features
          </SettingCard.Description>
        )}
      </SettingCard.Body>
      <SettingCard.Footer justifyContent="flex-end">
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
      </SettingCard.Footer>
    </SettingCard>
  )
}
