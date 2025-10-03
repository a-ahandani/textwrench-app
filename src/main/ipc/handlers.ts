import { BrowserWindow, ipcMain, shell } from 'electron'
import { IPC_EVENTS } from '../../shared/ipc-events'
import { store } from '../providers/store'
import { updateStore } from '../services/update-store'
import { paste } from 'textwrench-observer'

import {
  Category,
  Prompt,
  Shortcuts,
  StoreType,
  Template,
  UserProfile
} from '../../shared/types/store'
import { handleError, twService } from '../providers/axios'
import { verifyToken } from '../services/verify-token'
import { autoUpdater } from 'electron-updater'
import { setIsQuitting } from '../windows/settings'
import { BASE_URL } from '@shared/constants'
import { processText } from '../services/process-text'
import { getToolbarWindow } from '../windows/toolbar'

export function setupIpcHandlers(): void {
  ipcMain.handle(IPC_EVENTS.GET_STORE_VALUE, (_event, key: keyof StoreType) => {
    return store.get(key)
  })

  ipcMain.handle(IPC_EVENTS.SET_STORE_VALUE, (_event, key: keyof StoreType, value) => {
    updateStore(key, value)
    return true
  })

  ipcMain.handle(IPC_EVENTS.LOGIN, () => {
    updateStore('token', null)
    twService.defaults.headers.common['Authorization'] = ''
    return shell.openExternal(`${BASE_URL}/auth/google`)
  })

  ipcMain.handle(IPC_EVENTS.QUIT_AND_INSTALL, () => {
    setIsQuitting(true)
    autoUpdater.quitAndInstall()
    return
  })

  ipcMain.handle(IPC_EVENTS.LOGOUT, () => {
    updateStore('token', null)
    twService.defaults.headers.common['Authorization'] = ''
  })

  ipcMain.handle(IPC_EVENTS.GET_PROFILE, async () => {
    try {
      const result = await twService.get<UserProfile>('/protected/profile')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.GET_PROMPTS, async () => {
    try {
      const result = await twService.get<Prompt[]>('/protected/prompts')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.GET_TEMPLATES, async () => {
    try {
      const result = await twService.get<Template[]>('/protected/templates')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.GET_CATEGORIES, async () => {
    try {
      const result = await twService.get<Category[]>('/protected/categories')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.UPDATE_SHORTCUTS, async (_event, shortcuts: Shortcuts) => {
    try {
      const result = await twService.patch<Shortcuts>(`/protected/profile/shortcuts`, shortcuts)
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.UPDATE_PROMPT, async (_event, prompt: Prompt) => {
    const { ID, value, label } = prompt
    try {
      const result = await twService.put<Prompt>(`/protected/prompts/${ID}`, {
        value,
        label
      })
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.CREATE_PROMPT, async (_event, prompt: Prompt) => {
    const { value, label } = prompt
    try {
      const result = await twService.post<Prompt>(`/protected/prompts`, {
        value,
        label
      })
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.PROCESS_TEXT, async (_event, data) => {
    try {
      const result = await processText(data)
      return result
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.PASTE_TEXT, async (_event, data) => {
    try {
      const toolbarWindow = getToolbarWindow()
      toolbarWindow?.close()
      await paste(data)
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.DELETE_PROMPT, async (_event, prompt: Prompt) => {
    const { ID } = prompt
    try {
      const result = await twService.delete<Prompt>(`/protected/prompts/${ID}`)
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.CLOSE_WINDOW, () => {
    const window = BrowserWindow.getFocusedWindow()
    window?.close()
  })

  ipcMain.handle(IPC_EVENTS.VERIFY_TOKEN, () => {
    verifyToken()
  })

  ipcMain.handle(IPC_EVENTS.GET_USAGE_STATS, async () => {
    try {
      const result = await twService.get('/protected/usage/stats')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })
}
