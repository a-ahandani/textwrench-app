import { ElectronAPI } from '@electron-toolkit/preload'
import { StoreType } from '../main/store'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      onClipboardUpdated(callback: (text: string) => void): void
      getStoreValue<K extends keyof StoreType>(key: K): Promise<StoreType[K]>
      setStoreValue<K extends keyof StoreType>(key: K, value: StoreType[K]): Promise<boolean>
    }
  }
}
