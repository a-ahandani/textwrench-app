import { ipcMain, shell } from 'electron'
import { IPC_EVENTS } from '../../shared/ipc-events'
import { store } from '../store'
import { updateStore } from '../store/helpers'
import { Prompt, StoreType, UserProfile } from '../../shared/types/store'
import { handleError, twService } from '../services/axios/axios'

const apiServer = import.meta.env.VITE_API_SERVER

export function setupIpcHandlers() {
  ipcMain.handle(IPC_EVENTS.GET_STORE_VALUE, (_event, key: keyof StoreType) => {
    return store.get(key)
  })

  ipcMain.handle(IPC_EVENTS.SET_STORE_VALUE, (_event, key: keyof StoreType, value) => {
    updateStore(key, value)
    return true
  })

  ipcMain.handle(IPC_EVENTS.LOGIN, () => {
    return shell.openExternal(`${apiServer}/auth/google`)
  })

  ipcMain.handle(IPC_EVENTS.LOGOUT, () => {
    updateStore('token', null)
    twService.defaults.headers.common['Authorization'] = ''
  })

  ipcMain.handle(IPC_EVENTS.GET_PROFILE, async () => {
    try {
      const result = await twService.get<{ data: UserProfile }>('/protected/profile')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.GET_PROMPTS, async () => {
    try {
      const result = await twService.get<{ data: Prompt[] }>('/protected/prompts')
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })

  ipcMain.handle(IPC_EVENTS.UPDATE_PROMPT, async (_event, prompt: Prompt) => {
    const { ID, value, label } = prompt
    try {
      const result = await twService.put<{ data: Prompt }>(`/protected/prompts/${ID}`, {
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
      const result = await twService.post<{ data: Prompt }>(`/protected/prompts`, {
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
      const result = await twService.delete<{ data: Prompt }>(`/protected/prompts/${ID}`)
      return result.data
    } catch (error) {
      handleError(error)
    }
    return
  })
}
