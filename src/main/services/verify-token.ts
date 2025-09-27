import { twService } from '../providers/axios'
import { getSettingsWindow } from '../windows/settings'
import { getToolbarWindow } from '../windows/toolbar'
import { store } from '../providers/store'
import { IPC_EVENTS } from '@shared/ipc-events'
import { bringToFront } from './set-focus'

export async function verifyToken(): Promise<void> {
  const settingsWindow = getSettingsWindow()
  const toolbarWindow = getToolbarWindow()
  const token = store.get('token')

  if (!token) {
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    // Surface settings for user to login
    bringToFront()
    return
  }
  twService.defaults.headers.common['Authorization'] = `Bearer ${token}`
  try {
    await twService.get('/protected/profile')
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } catch {
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    // Invalid token -> show login
    bringToFront()
  }
}
