import { twService } from '../providers/axios'
import { getSettingsWindow } from '../windows/settings'
import { store } from '../providers/store'
import { IPC_EVENTS } from '@shared/ipc-events'

export async function verifyToken(): Promise<void> {
  const settingsWindow = getSettingsWindow()
  if (!settingsWindow) return
  const token = store.get('token')

  if (!token) {
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    return
  }
  twService.defaults.headers.common['Authorization'] = `Bearer ${token}`
  try {
    await twService.get('/protected/profile')
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } catch {
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
  }
}
