import { ACTION_DEFAULT_SHORTCUTS, ACTIONS, PLATFORMS } from '../../shared/constants'
import { hotkeyClient } from '../providers/hotkeys'

export const setShortcuts = (shortcuts: Record<string, Record<string, string>>): void => {
  const updatedShortcuts = shortcuts?.[PLATFORMS[process.platform]] || {}

  const shortcutConfig: { id: string; key: string; modifiers: string[] }[] = []

  Object.entries(ACTIONS).forEach(([actionKey, action]) => {
    const defaultShortcut = ACTION_DEFAULT_SHORTCUTS[action]?.join('+') || 'Ctrl+Shift+C'
    const shortcut = updatedShortcuts[action] || defaultShortcut

    shortcutConfig.push({
      id: ACTIONS[actionKey],
      key: shortcut.split('+').pop() || 'C',
      modifiers: shortcut.split('+').slice(0, -1)
    })
  })
  const key = `SHORTCUT_CONFIG|${JSON.stringify(shortcutConfig)}`
  hotkeyClient.send(key)
}
