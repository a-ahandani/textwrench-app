import log from 'electron-log'
import { updateStore } from './update-store'
import { getSettingsWindow } from '../windows/settings'
import { IPC_EVENTS } from '@shared/ipc-events'
import { bringToFront } from './set-focus'

export function handleOpenUrl(url): void {
  const settingsWindow = getSettingsWindow()
  bringToFront()

  try {
    const urlParams = new URL(url)
    const token = urlParams.searchParams.get('token')

    if (token) {
      updateStore('token', token)
      settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
    } else {
      settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
  } catch (error) {
    log.error('Invalid URL:', url, error)
  }
}
