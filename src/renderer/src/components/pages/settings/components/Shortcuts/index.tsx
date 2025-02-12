import { Card, ProgressRoot } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from '../../../../providers/AuthProvider'
import { ProgressBar } from '../../../../ui/Progress'

import { Hotkeys } from './Hotkeys'
import { KEY_NAMES } from '@shared/constants'

const transformValueToKeys = (value?: string[]) =>
  (value?.map((v) => Object.keys(KEY_NAMES).find((key) => KEY_NAMES[key] === v)) || []).filter(
    Boolean
  ) as string[]

const transformKeysToValue = (value?: string[]) => value?.map((key) => KEY_NAMES[key])

export const Shortcuts = () => {
  const { isLoggedIn, setIsLoading } = useAuth()
  const { data: profile, isLoading } = useProfile({ enabled: isLoggedIn })

  const handleSubmit = (value) => {
    console.log('value submitted', transformKeysToValue(value))
  }
  if (!isLoggedIn) return null
  return (
    <Card.Root my={1} variant="subtle">
      <Card.Body>
        {isLoading && (
          <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
            <ProgressBar />
          </ProgressRoot>
        )}
        <Card.Title fontSize="sm">Modify keyboard Shortcuts</Card.Title>
        <Card.Description>
          Start with a modifier key (Ctrl, Alt, or Cmd), then add a letter. You can use up to two
          modifiers and one letter.
          <Hotkeys
            label="Action key"
            value={transformValueToKeys(['Meta', 'Shift', 'C'])}
            onSubmit={handleSubmit}
          />
        </Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
