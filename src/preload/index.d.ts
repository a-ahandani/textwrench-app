import { ElectronAPI } from '@electron-toolkit/preload'
import { Category, Prompt, StoreType } from '../shared/types/store'
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
      getTemplates(): Promise<Template[]>
      getCategories(): Promise<Category[]>
      onLoggedIn(callback: (data) => void): () => void
      closeWindow(): void
      verifyToken(): Promise<void>
      updateShortcuts(shortcuts: Partial<Shortcuts>): Promise<Shortcuts>
      quitAndInstall(): Promise<Version>
      onUpdateDownloaded(callback: (data) => void): () => void
      onUpdateAvailable(callback: (data) => void): () => void
      onUpdateProgress(callback: (data) => void): () => void
      onOpenModal(callback: (data) => void): () => void
      processText(
        prompt: Partial<ProcessTextPayload & { mode?: string }>
      ): Promise<ProcessTextPayload>
      // Streaming text processing API
      startTextStream(payload: Partial<ProcessTextPayload & { mode?: string }>): Promise<void>
      cancelTextStream(): Promise<void>
      onTextStreamChunk(callback: (data: { content?: string; error?: string }) => void): () => void
      onTextStreamDone(callback: () => void): () => void
      onTextStreamError(callback: (data: { error: string }) => void): () => void
      hidePaste(text?: string): Promise<void>
      onSetSelectedText(callback: (data) => void): () => void
      pasteText(text: string | { text: string; appPID: number }): Promise<void>
      onToolbarResetUI(callback: () => void): () => void
      onToolbarOpenPanel(callback: (data: { panel?: string | null }) => void): () => void
      onUsageLimitReached(
        callback: (data: {
          allowed: boolean
          remaining: number
          limit: number
          actionCount: number
          plan: string
        }) => void
      ): () => void
      getUsageStats(): Promise<{
        today: number
        limit: number
        remaining: number
        windows: Record<string, number[]>
        totals: Record<string, number>
        allTime: number
        currentDate: string
      }>
    }
  }
}
