import log from 'electron-log'
import { updateStore } from '../../store/helpers'
import { getMainWindow } from '../window/window'
import { IPC_EVENTS } from '@shared/ipc-events'
import { bringToFront } from '../../utils/bringToFront'

export function handleOpenUrl(url): void {
  const mainWindow = getMainWindow()
  bringToFront()

  try {
    const urlParams = new URL(url)
    const token = urlParams.searchParams.get('token')

    if (token) {
      updateStore('token', token)
      mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
    } else {
      mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
  } catch (error) {
    log.error('Invalid URL:', url, error)
  }
}
