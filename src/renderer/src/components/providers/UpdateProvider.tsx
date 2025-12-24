import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { useStore } from '@renderer/hooks/useStore'

type UpdateContextType = {
  isUpdateAvailable: boolean
  isUpdateDownloaded: boolean
  isCheckingForUpdate: boolean
  latestVersion: string
  currentVersion: string
  releaseNotes: string
  progress: number
  updateError: string
  checkForUpdates: () => void
  quitAndInstall: () => void
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined)

type UpdateProviderProps = {
  children: ReactNode
}

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const { quitAndInstall, checkForUpdates } = window.api

  const { value: currentVersion } = useStore<string>({
    key: 'appVersion'
  })
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)
  const [latestVersion, setLatestVersion] = useState<string>('')
  const [releaseNotes, setReleaseNotes] = useState<string>('')
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState<boolean>(false)
  const [updateError, setUpdateError] = useState<string>('')

  useEventSubscription({
    eventName: 'onUpdateChecking',
    callback: () => {
      setIsCheckingForUpdate(true)
      setUpdateError('')
    }
  })

  useEventSubscription({
    eventName: 'onUpdateNotAvailable',
    callback: () => {
      setIsCheckingForUpdate(false)
      setIsUpdateAvailable(false)
      setIsUpdateDownloaded(false)
      setLatestVersion('')
      setReleaseNotes('')
      setProgress(0)
    }
  })

  useEventSubscription({
    eventName: 'onUpdateError',
    callback: (data: { message?: string }) => {
      setIsCheckingForUpdate(false)
      setUpdateError(data?.message || 'Update check failed')
    }
  })

  useEventSubscription({
    eventName: 'onUpdateDownloaded',
    callback: () => {
      setIsCheckingForUpdate(false)
      setIsUpdateDownloaded(true)
    }
  })

  useEventSubscription({
    eventName: 'onUpdateProgress',
    callback: (data: { percent: number }) => {
      setProgress(data?.percent)
    }
  })

  useEventSubscription({
    eventName: 'onUpdateAvailable',
    callback: (data: { version: string; releaseNotes: string }) => {
      setIsCheckingForUpdate(false)
      setUpdateError('')
      setLatestVersion(data.version)
      setReleaseNotes(data.releaseNotes)
      setIsUpdateAvailable(true)
    }
  })

  return (
    <UpdateContext.Provider
      value={{
        isUpdateAvailable,
        isUpdateDownloaded,
        isCheckingForUpdate,
        currentVersion,
        latestVersion,
        releaseNotes,
        progress,
        updateError,
        checkForUpdates: () => void checkForUpdates(),
        quitAndInstall: () => quitAndInstall()
      }}
    >
      {children}
    </UpdateContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUpdate = (): UpdateContextType => {
  const context = useContext(UpdateContext)
  if (!context) {
    throw new Error('useUpdate must be used within an UpdateProvider')
  }
  return context
}
