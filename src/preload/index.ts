import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC_EVENTS } from '@shared/ipc-events'

import log from 'electron-log'

window.__electronLog = log

const createIpcListener =
  (event: string) =>
  (callback: (data: unknown) => void): (() => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: unknown): void => callback(data)
    ipcRenderer.on(event, subscription)
    return (): void => {
      ipcRenderer.removeListener(event, subscription)
    }
  }

const api = {
  onStoreChange: createIpcListener(IPC_EVENTS.STORE_CHANGED),
  onUpdateProgress: createIpcListener(IPC_EVENTS.UPDATE_PROGRESS),
  onUpdateDownloaded: createIpcListener(IPC_EVENTS.UPDATE_DOWNLOADED),
  onUpdateAvailable: createIpcListener(IPC_EVENTS.UPDATE_AVAILABLE),
  onOpenModal: createIpcListener(IPC_EVENTS.OPEN_MODAL),
  onLoggedIn: createIpcListener(IPC_EVENTS.LOGIN_FULFILLED),
  getStoreValue: (key: string): Promise<unknown> =>
    ipcRenderer.invoke(IPC_EVENTS.GET_STORE_VALUE, key),
  setStoreValue: (key: string, value: unknown): Promise<void> =>
    ipcRenderer.invoke(IPC_EVENTS.SET_STORE_VALUE, key, value),
  quitAndInstall: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.QUIT_AND_INSTALL),
  getProfile: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_PROFILE),
  getPrompts: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_PROMPTS),
  updateShortcuts: (shortcuts): Promise<unknown> =>
    ipcRenderer.invoke(IPC_EVENTS.UPDATE_SHORTCUTS, shortcuts),
  updatePrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.UPDATE_PROMPT, prompt),
  createPrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.CREATE_PROMPT, prompt),
  deletePrompt: (prompt): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.DELETE_PROMPT, prompt),
  getTemplates: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_TEMPLATES),
  getCategories: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.GET_CATEGORIES),
  login: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.LOGIN),
  logout: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.LOGOUT),
  closeWindow: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.CLOSE_WINDOW),
  verifyToken: (): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.VERIFY_TOKEN),
  processText: (text): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.PROCESS_TEXT, text),
  hidePaste: (text): Promise<unknown> => ipcRenderer.invoke(IPC_EVENTS.HIDE_PASTE, text)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    log.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
