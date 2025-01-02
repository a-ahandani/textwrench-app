import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '../main/ipc/constants'

const api = {
  getStoreValue: (key: string) => ipcRenderer.invoke(IPC_EVENTS.GET_STORE_VALUE, key),
  setStoreValue: (key: string, value) => ipcRenderer.invoke(IPC_EVENTS.SET_STORE_VALUE, key, value),
  onStoreChange: (callback) => {
    const subscription = (_event, data) => callback(data)
    ipcRenderer.on(IPC_EVENTS.STORE_CHANGED, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.STORE_CHANGED, subscription)
    }
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
