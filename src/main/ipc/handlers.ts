// handlers.ts
import { ipcMain } from 'electron'
import { IPC_EVENTS } from './constants'
import { store } from '../store'

export function setupIpcHandlers() {
  ipcMain.handle(IPC_EVENTS.GET_STORE_VALUE, (_event, key: string) => {
    return store.get(key)
  })

  ipcMain.handle(IPC_EVENTS.SET_STORE_VALUE, (_event, key: string, value) => {
    store.set(key, value)
    _event.sender.send(IPC_EVENTS.STORE_CHANGED, {
      key,
      value,
      oldValue: store.get(key)
    })
    return true
  })
}
