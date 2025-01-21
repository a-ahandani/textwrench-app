import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '../shared/ipc-events'

const api = {
  getStoreValue: (key: string) => ipcRenderer.invoke(IPC_EVENTS.GET_STORE_VALUE, key),
  setStoreValue: (key: string, value) => ipcRenderer.invoke(IPC_EVENTS.SET_STORE_VALUE, key, value),
  onStoreChange: (callback) => {
    const subscription = (_event, data) => callback(data)
    ipcRenderer.on(IPC_EVENTS.STORE_CHANGED, subscription)
    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.STORE_CHANGED, subscription)
    }
  },
  getProfile: () => ipcRenderer.invoke(IPC_EVENTS.GET_PROFILE),
  getPrompts: () => ipcRenderer.invoke(IPC_EVENTS.GET_PROMPTS),
  updatePrompt: (prompt) => ipcRenderer.invoke(IPC_EVENTS.UPDATE_PROMPT, prompt),
  createPrompt: (prompt) => ipcRenderer.invoke(IPC_EVENTS.CREATE_PROMPT, prompt),
  login: () => ipcRenderer.invoke(IPC_EVENTS.LOGIN),
  logout: () => ipcRenderer.invoke(IPC_EVENTS.LOGOUT),
  onLoggedIn: (callback) =>
    ipcRenderer.on(IPC_EVENTS.LOGIN_FULFILLED, (_event, value) => callback(value))
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
