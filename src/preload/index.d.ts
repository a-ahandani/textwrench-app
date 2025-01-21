import { ElectronAPI } from '@electron-toolkit/preload'
import { Prompt, StoreType } from '../shared/types/store'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getStoreValue<K extends keyof StoreType>(key: K): Promise<StoreType[K]>
      setStoreValue<K extends keyof StoreType>(key: K, value: StoreType[K]): Promise<boolean>
      onStoreChange(callback: (data) => void): () => void
      login(): Promise<void>
      logout(): Promise<void>
      getProfile(): Promise<UserProfile>
      getPrompts(): Promise<Prompt[]>
      updatePrompt(prompt: Partial<Prompt>): Promise<Prompt>
      createPrompt(prompt: Partial<Prompt>): Promise<Prompt>
      deletePrompt(prompt: Partial<Prompt>): Promise<Prompt>
      onLoggedIn(callback: (data) => void): () => void
    }
  }
}
