import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'

type TextContextType = {
  data: { text: string; position: { x: number; y: number }; window: { appPID: number } } | undefined
}

const SelectedTextContext = createContext<TextContextType | undefined>(undefined)

type SelectedTextProviderProps = {
  children: ReactNode
}

export const SelectedTextProvider: React.FC<SelectedTextProviderProps> = ({ children }) => {
  const [data, setData] = useState<
    { text: string; position: { x: number; y: number }; window: { appPID: number } } | undefined
  >(undefined)

  useEventSubscription<{
    text: string
    position: { x: number; y: number }
    window: { appPID: number }
  }>({
    eventName: 'onSetSelectedText',
    callback: (data) => {
      setData(data)
    }
  })

  return (
    <SelectedTextContext.Provider
      value={{
        data
      }}
    >
      {children}
    </SelectedTextContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSelectedText = (): TextContextType => {
  const context = useContext(SelectedTextContext)
  if (!context) {
    throw new Error('useSelectedText must be used within an SelectedTextProvider')
  }
  return context
}
