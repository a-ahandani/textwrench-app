import { FC } from 'react'
import { Card, Kbd, ProgressRoot } from '@chakra-ui/react'
import { useProfile } from '@renderer/hooks/useProfile'

import { Hotkeys } from './Hotkeys'
import { ACTION_DEFAULT_SHORTCUTS, ACTION_LABELS, ACTIONS, KEY_NAMES } from '@shared/constants'
import { useUpdateShortcuts } from '@renderer/hooks/useUpdateShortcuts'
import { useAuth } from '@renderer/components/providers/AuthProvider'
import { ProgressBar } from '@renderer/components/ui/Progress'

const transformValueToKeys = (value?: string[]) =>
  (value?.map((v) => Object.keys(KEY_NAMES).find((key) => KEY_NAMES[key] === v)) || []).filter(
    Boolean
  ) as string[]

const transformKeysToValue = (value?: string[]) => value?.map((key) => KEY_NAMES[key])

export const Shortcuts: FC = () => {
  const { isLoggedIn } = useAuth()
  const { data: profile, isLoading, isFetched } = useProfile({ enabled: isLoggedIn })
  const shortcuts = profile?.shortcuts || {}

  const { mutate: updateShortcuts } = useUpdateShortcuts({})
  const handleSubmit = (key, value): void => {
    const updatedShortcuts = {
      ...shortcuts,
      [key]: transformKeysToValue(value)
    }
    const updatedShortcutsTransformed = Object.keys(updatedShortcuts).reduce((acc, key) => {
      return {
        ...acc,
        [key]: updatedShortcuts[key]?.join('+')
      }
    }, {})
    updateShortcuts(updatedShortcutsTransformed)
  }

  if (!isLoggedIn || !isFetched) return null
  return (
    <Card.Root my={2} variant="outline">
      <Card.Body>
        {isLoading && (
          <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
            <ProgressBar />
          </ProgressRoot>
        )}
        <Card.Title fontSize="sm">Modify keyboard Shortcuts</Card.Title>
        <Card.Description as="div">
          Start with a modifier key
          <Kbd mx="1" variant="raised" size="sm">
            Ctrl
          </Kbd>
          ,
          <Kbd mx="1" variant="raised" size="sm">
            Alt
          </Kbd>
          or
          <Kbd mx="1" variant="raised" size="sm">
            Cmd
          </Kbd>
          , then add a letter. You can use up to two modifiers and one letter.
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
