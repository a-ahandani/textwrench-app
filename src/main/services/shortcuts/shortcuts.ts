import { ACTION_DEFAULT_SHORTCUTS, ACTIONS, PLATFORMS } from '../../../shared/constants'
import { globalShortcut } from 'electron'
import { handlers } from '../../ipc'

export const resetShortcuts = (shortcuts: Record<string, Record<string, string>>) => {
  globalShortcut.unregisterAll()

  const updatedShortcuts = shortcuts?.[PLATFORMS[process.platform]] || {}

  Object.entries(ACTIONS).forEach(([actionKey, action]) => {
    const defaultShortcut = ACTION_DEFAULT_SHORTCUTS[action]?.join('+') || 'Ctrl+Shift+C'
    const customShortcut = updatedShortcuts[action] ?? defaultShortcut
    const handler = handlers[action]
    if (!handler) {
      console.warn(`No handler found for action: ${actionKey}`)
      return
    }

    const success = globalShortcut.register(customShortcut, handler)
    if (!success) {
      console.error(`Failed to register shortcut: ${customShortcut} for action: ${actionKey}`)
    }
  })
}
