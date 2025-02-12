import { Card, ProgressRoot } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'
import { useAuth } from '../../../../providers/AuthProvider'
import { ProgressBar } from '../../../../ui/Progress'

import { Hotkeys } from './Hotkeys'
import { ACTION_DEFAULT_SHORTCUTS, ACTION_LABELS, ACTIONS, KEY_NAMES } from '@shared/constants'
import { useUpdateShortcuts } from '@renderer/hooks/useUpdateShortcuts'

const transformValueToKeys = (value?: string[]) =>
  (value?.map((v) => Object.keys(KEY_NAMES).find((key) => KEY_NAMES[key] === v)) || []).filter(
    Boolean
  ) as string[]

const transformKeysToValue = (value?: string[]) => value?.map((key) => KEY_NAMES[key])

export const Shortcuts = () => {
  const { isLoggedIn } = useAuth()
  const { data: profile, isLoading, isFetched } = useProfile({ enabled: isLoggedIn })
  const shortcuts = profile?.shortcuts || {}

  const { mutate: updateShortcuts } = useUpdateShortcuts({})
  const handleSubmit = (key, value) => {
    updateShortcuts({ ...shortcuts, [key]: transformKeysToValue(value)?.join('+') })
  }
  if (!isLoggedIn || !isFetched) return null
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
          {Object.values(ACTIONS).map((action) => {
            return (
              <Hotkeys
                key={action}
                label={ACTION_LABELS[action]}
                value={transformValueToKeys(
                  shortcuts?.[action] || ACTION_DEFAULT_SHORTCUTS[action]
                )}
                onSubmit={(value) => handleSubmit(action, value)}
              />
            )
          })}
        </Card.Description>
      </Card.Body>
    </Card.Root>
  )
}
