import { store } from './index'
import { getMainWindow } from '../services/window/window'
import { IPC_EVENTS } from '@shared/ipc-events'
import { StoreType } from '../../shared/types/store'

export const updateStore = (key: keyof StoreType, value) => {
  const mainWindow = getMainWindow()

  store.set(key, value)

  if (mainWindow) {
    mainWindow.webContents.send(IPC_EVENTS.STORE_CHANGED, {
      key: key,
      value: value,
      oldValue: store.get(key)
    })
  }
}
