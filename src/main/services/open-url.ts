import log from 'electron-log'
import { updateStore } from './update-store'
import { getSettingsWindow } from '../windows/settings'
import { getToolbarWindow } from '../windows/toolbar'
import { IPC_EVENTS } from '@shared/ipc-events'
import { bringToFront } from './set-focus'
import { APP_KEY } from '@shared/constants'
import { store } from '../providers/store'

const AUTH_TTL_MS = 10 * 60 * 1000

function getCallbackState(urlParams: URL): string | null {
  const stateFromQuery = urlParams.searchParams.get('state')
  if (stateFromQuery) return stateFromQuery
  if (!urlParams.hash) return null
  const hashParams = new URLSearchParams(
    urlParams.hash.startsWith('#') ? urlParams.hash.slice(1) : urlParams.hash
  )
  return hashParams.get('state')
}

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
    const state = getCallbackState(urlParams)
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

    if (state) {
      if (!authState || authState !== state) {
        log.warn('Auth callback state mismatch', { authState, state })
        updateStore('authStartAt', null)
        updateStore('authState', null)
        settingsWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
        toolbarWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
        return
      }
    } else if (authState) {
      log.warn('Auth callback missing state; proceeding without verification', { authState })
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
