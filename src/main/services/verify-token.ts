import { twService } from '../providers/axios'
import { getSettingsWindow } from '../windows/settings'
import { getToolbarWindow } from '../windows/toolbar'
import { store } from '../providers/store'
import { IPC_EVENTS } from '@shared/ipc-events'
import { requestAppFocus } from './set-focus'

export async function verifyToken(): Promise<void> {
  const settingsWindow = getSettingsWindow()
  const toolbarWindow = getToolbarWindow()
  const token = store.get('token')

  if (!token) {
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    // Passive surface (do not aggressively steal focus) so user sees login when convenient.
    requestAppFocus({ aggressive: false, window: settingsWindow, reason: 'missing-token' })
    return
  }
  twService.defaults.headers.common['Authorization'] = `Bearer ${token}`
  try {
    await twService.get('/protected/profile')
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } catch {
    // Handle token verification error
  }
}
