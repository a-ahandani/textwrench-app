import { ipcMain } from 'electron'
import { IPC_EVENTS } from './constants'
import { store } from '../store'
import { updateStore } from '../store/helpers'
import { StoreType } from '../../shared/types/store'

export function setupIpcHandlers() {
  ipcMain.handle(IPC_EVENTS.GET_STORE_VALUE, (_event, key: keyof StoreType) => {
    return store.get(key)
  })

  ipcMain.handle(IPC_EVENTS.SET_STORE_VALUE, (_event, key: keyof StoreType, value) => {
    updateStore(key, value)
    return true
  })
}
