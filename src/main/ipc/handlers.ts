import { BrowserWindow, ipcMain, shell } from 'electron'
import { IPC_EVENTS } from '../../shared/ipc-events'
import { PLATFORMS_DL_URL } from '../../shared/constants'
import { store } from '../store'
import { updateStore } from '../store/helpers'
import { Prompt, Shortcuts, StoreType, UserProfile } from '../../shared/types/store'
import { handleError, twService } from '../services/axios/axios'
import { verifyToken } from '../services/auth/verifyToken'
import { resetShortcuts } from '../services/shortcuts/shortcuts'
import axios from 'axios'


const apiServer = import.meta.env.VITE_API_SERVER
const versionServer = import.meta.env.VITE_APP_VERSION
const downloadServer = import.meta.env.VITE_DOWNLOAD_SERVER

export function setupIpcHandlers() {
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
    return shell.openExternal(`${apiServer}/auth/google`)
  })

  ipcMain.handle(IPC_EVENTS.DOWNLOAD, () => {
    return shell.openExternal(`${downloadServer}/${PLATFORMS_DL_URL[process.platform]}`)
  })

  ipcMain.handle(IPC_EVENTS.LOGOUT, () => {
    updateStore('token', null)
    twService.defaults.headers.common['Authorization'] = ''
  })

  ipcMain.handle(IPC_EVENTS.GET_PROFILE, async () => {
    try {
      const result = await twService.get<UserProfile>('/protected/profile')
      resetShortcuts(result.data?.shortcuts)
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

  ipcMain.handle(IPC_EVENTS.UPDATE_SHORTCUTS, async (_event, shortcuts: Shortcuts) => {
    try {
      const result = await twService.patch<Shortcuts>(
        `/protected/profile/shortcuts`,
        shortcuts
      )
      resetShortcuts(result.data)
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

  ipcMain.handle(IPC_EVENTS.GET_VERSION, async () => {
    try {
      const result = await axios.get(versionServer)
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
}
