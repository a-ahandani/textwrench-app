import { store } from './index'
import { getMainWindow } from '../services/window/window'
import { StoreType } from '@shared/types/store'
import { IPC_EVENTS } from '@shared/ipc-events'

export const updateStore = (key: keyof StoreType, value): void => {
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
