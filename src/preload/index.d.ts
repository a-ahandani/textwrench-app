import { ElectronAPI } from '@electron-toolkit/preload'
import { StoreType } from '../shared/types/store'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getStoreValue<K extends keyof StoreType>(key: K): Promise<StoreType[K]>
      setStoreValue<K extends keyof StoreType>(key: K, value: StoreType[K]): Promise<boolean>
      onStoreChange(callback: (data) => void): () => void
      login(): Promise<void>
      logout(): Promise<void>
      getProfile(): Promise<void>
    }
  }
}
