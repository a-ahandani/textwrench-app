import { twService } from '../providers/axios'
import { getMainWindow } from '../providers/window'
import { store } from '../providers/store'
import { IPC_EVENTS } from '@shared/ipc-events'

export async function verifyToken(): Promise<void> {
  const mainWindow = getMainWindow()
  if (!mainWindow) return
  const token = store.get('token')

  if (!token) {
    mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    return
  }
  twService.defaults.headers.common['Authorization'] = `Bearer ${token}`

  try {
    await twService.get('/protected/profile')
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } catch {
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
  }
}
