import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '@shared/ipc-events'

import log from 'electron-log'

window.__electronLog = log

const api = {
  getStoreValue: (key: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC_EVENTS.GET_STORE_VALUE, key),
  setStoreValue: (key: string, value: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC_EVENTS.SET_STORE_VALUE, key, value),
  onStoreChange: (callback): (() => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: unknown): void => callback(data)
    ipcRenderer.on(IPC_EVENTS.STORE_CHANGED, subscription)
    return (): void => {
      ipcRenderer.removeListener(IPC_EVENTS.STORE_CHANGED, subscription)
    }
  },
  onUpdateDownloaded: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: unknown): void => callback(data)
    ipcRenderer.on(IPC_EVENTS.UPDATE_DOWNLOADED, subscription)
    return (): void => {
      ipcRenderer.removeListener(IPC_EVENTS.UPDATE_DOWNLOADED, subscription)
    }
  },
  onUpdateAvailable: (callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: unknown): void => callback(data)
    ipcRenderer.on(IPC_EVENTS.UPDATE_AVAILABLE, subscription)
    return (): void => {
      ipcRenderer.removeListener(IPC_EVENTS.UPDATE_AVAILABLE, subscription)
    }
  },
  quitAndInstall: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.QUIT_AND_INSTALL),
  getProfile: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_PROFILE),
  getPrompts: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_PROMPTS),
  updateShortcuts: (shortcuts): Promise<unknown> =>
    ipcRenderer.invoke(IPC_EVENTS.UPDATE_SHORTCUTS, shortcuts),
  updatePrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.UPDATE_PROMPT, prompt),
  createPrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.CREATE_PROMPT, prompt),
  deletePrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.DELETE_PROMPT, prompt),
  login: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.LOGIN),
  logout: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.LOGOUT),
  onLoggedIn: (callback) => {
    const subscription = (_event, data): void => callback(data)
    ipcRenderer.on(IPC_EVENTS.LOGIN_FULFILLED, subscription)
    return (): void => {
      ipcRenderer.removeListener(IPC_EVENTS.LOGIN_FULFILLED, subscription)
    }
  },
  closeWindow: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.CLOSE_WINDOW),
  verifyToken: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.VERIFY_TOKEN)
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
