import { globalShortcut } from 'electron'

export const registerShortcut = (
  accelerator: Electron.Accelerator,
  callback: () => void
): boolean => {
  return globalShortcut.register(accelerator, callback)
}

export const unregisterShortcut = (accelerator: Electron.Accelerator): void => {
  globalShortcut.unregister(accelerator)
}
