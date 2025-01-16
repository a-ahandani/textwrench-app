import { ipcMain, shell } from 'electron'
import { IPC_EVENTS } from './constants'
import { store } from '../store'
import { updateStore } from '../store/helpers'
import { StoreType } from '../../shared/types/store'
import { twService } from '../services/axios/axios'
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
    updateStore('profile', null)
    updateStore('token', null)
  })

  ipcMain.handle(IPC_EVENTS.GET_PROFILE, async () => {
    const profile = await twService.get('/protected/profile')
    updateStore('profile', profile.data)
  })
}
