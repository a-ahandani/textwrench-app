import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { useStore } from '@renderer/hooks/useStore'

type UpdateContextType = {
  isUpdateAvailable: boolean
  isUpdateDownloaded: boolean
  latestVersion: string
  currentVersion: string
  releaseNotes: string
  quitAndInstall: () => void
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined)

type UpdateProviderProps = {
  children: ReactNode
}

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const { quitAndInstall } = window.api

  const { value: currentVersion } = useStore<string>({
    key: 'appVersion'
  })
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false)
  const [latestVersion, setLatestVersion] = useState<string>('')
  const [releaseNotes, setReleaseNotes] = useState<string>('')
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState<boolean>(false)

  useEventSubscription({
    eventName: 'onUpdateDownloaded',
    callback: () => {
      setIsUpdateDownloaded(true)
    }
  })

  useEventSubscription({
    eventName: 'onUpdateAvailable',
    callback: (data: { version: string; releaseNotes: string }) => {
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
        currentVersion,
        latestVersion,
        releaseNotes,
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
