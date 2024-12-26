import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '../main/services/ipc/constants'

const api = {
  onClipboardUpdated: (callback: (text: string) => void) => {
    ipcRenderer.on(IPC_EVENTS.CLIPBOARD_UPDATED, (_, text) => callback(text))
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
