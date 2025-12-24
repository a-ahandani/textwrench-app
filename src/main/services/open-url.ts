import log from 'electron-log'
import { updateStore } from './update-store'
import { getSettingsWindow } from '../windows/settings'
import { getToolbarWindow } from '../windows/toolbar'
import { IPC_EVENTS } from '@shared/ipc-events'
import { bringToFront } from './set-focus'
import { APP_KEY } from '@shared/constants'
import { store } from '../providers/store'

const AUTH_TTL_MS = 10 * 60 * 1000

export function handleOpenUrl(url): void {
  const settingsWindow = getSettingsWindow()
  const toolbarWindow = getToolbarWindow()

  try {
    const urlParams = new URL(url)
    if (urlParams.protocol !== `${APP_KEY}:`) {
      log.warn('Ignoring unexpected protocol URL:', url)
      return
    }
    const token = urlParams.searchParams.get('token')
    const state = urlParams.searchParams.get('state')
    const authStartAt = store.get('authStartAt')
    const authState = store.get('authState')
    const now = Date.now()
    const isAuthFresh =
      typeof authStartAt === 'number' && authStartAt > 0 && now - authStartAt <= AUTH_TTL_MS

    if (!authStartAt) {
      log.warn('Ignoring auth callback without active login', url)
      return
    }

    if (!isAuthFresh) {
      log.warn('Auth callback arrived after timeout', { authStartAt, now })
      updateStore('authStartAt', null)
      updateStore('authState', null)
      settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      return
    }

    if (!authState || !state || authState !== state) {
      log.warn('Auth callback state mismatch', { authState, state })
      updateStore('authStartAt', null)
      updateStore('authState', null)
      settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      return
    }

    bringToFront()
    updateStore('authStartAt', null)
    updateStore('authState', null)

    if (!token) {
      settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
      return
    }

    updateStore('token', token)
    settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
    toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } catch (error) {
    log.error('Invalid URL:', url, error)
  }
}
