import { store } from '../providers/store'
import { getSettingsWindow } from '../windows/settings'
import { StoreType } from '@shared/types/store'
import { IPC_EVENTS } from '@shared/ipc-events'

export const updateStore = (key: keyof StoreType, value): void => {
  const settingsWindow = getSettingsWindow()

  store.set(key, value)

  if (settingsWindow) {
    settingsWindow.webContents.send(IPC_EVENTS.STORE_CHANGED, {
      key: key,
      value: value,
      oldValue: store.get(key)
    })
  }
}
