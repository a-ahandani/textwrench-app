import { store } from './index'
import { getMainWindow } from '../services/window/window'
import { IPC_EVENTS } from '../ipc/constants'

export const updateStore = (key: string, value) => {
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
