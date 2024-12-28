import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getPromptOptions(): Promise<{ value: string; label: string }[]>
      onClipboardUpdated(callback: (text: string) => void): void
    }
  }
}
