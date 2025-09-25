import { store } from '../providers/store'
import { getSettingsWindow } from '../windows/settings'
import { getToolbarWindow } from '../windows/toolbar'
import { StoreType } from '@shared/types/store'
import { IPC_EVENTS } from '@shared/ipc-events'

export const updateStore = (key: keyof StoreType, value): void => {
  const settingsWindow = getSettingsWindow()
  const toolbarWindow = getToolbarWindow()

  store.set(key, value)

  const storeChangeEvent = {
    key: key,
    value: value,
    oldValue: store.get(key)
  }

  if (settingsWindow) {
    settingsWindow.webContents.send(IPC_EVENTS.STORE_CHANGED, storeChangeEvent)
  }

  if (toolbarWindow) {
    toolbarWindow.webContents.send(IPC_EVENTS.STORE_CHANGED, storeChangeEvent)
  }
}
