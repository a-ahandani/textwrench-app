import { ACTION_DEFAULT_SHORTCUTS, ACTIONS, PLATFORMS } from '../../../shared/constants'
import { globalShortcut } from 'electron'
import { handlers } from '../../ipc'

export const registerShortcut = (
  accelerator: Electron.Accelerator,
  callback: () => void
): boolean => {
  return globalShortcut.register(accelerator, callback)
}

export const unregisterShortcut = (accelerator: Electron.Accelerator): void => {
  globalShortcut.unregister(accelerator)
}

export const resetShortcuts = (shortcuts) => {
  globalShortcut.unregisterAll()
  const updatedShortcuts = shortcuts?.[PLATFORMS[process.platform]]

  Object.values(ACTIONS).forEach((action) => {
    const hotKeys = updatedShortcuts[action] || ACTION_DEFAULT_SHORTCUTS[action]
    const handler = handlers[action]
    globalShortcut.register(hotKeys, handler)
  })
}
