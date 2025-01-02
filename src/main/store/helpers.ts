import { store } from './index'
import { getMainWindow } from '../services/window/window'
import { IPC_EVENTS } from '../ipc/constants'
import { ipcMain } from 'electron'
import { StoreType } from '../../shared/types/store'

export const updateStore = (key: keyof StoreType, value) => {
  const mainWindow = getMainWindow()

  store.set(key, value)

  ipcMain.emit(IPC_EVENTS.STORE_CHANGED, {
    key,
    value,
    oldValue: store.get(key)
  })

  if (mainWindow) {
    mainWindow.webContents.send(IPC_EVENTS.STORE_CHANGED, {
      key: key,
      value: value,
      oldValue: store.get(key)
    })
  }
}
