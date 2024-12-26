import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onClipboardUpdated(callback: (text: string) => void): void
    }
  }
}
