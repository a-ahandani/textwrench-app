import { IPC_EVENTS } from '../../../shared/ipc-events'
import { updateStore } from '../../store/helpers'
import { getMainWindow } from '../window/window'

export function handleOpenUrl(url): void {
  const mainWindow = getMainWindow()

  const urlParams = new URL(url)
  const token = urlParams.searchParams.get('token')

  if (token) {
    updateStore('token', token)
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } else {
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
  }
}
