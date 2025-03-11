import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'

type ModalContextType = {
  isOpen: boolean
  modalType: string
  content: string
  setIsOpen: (isOpen: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

type ModalProviderProps = {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [modalType, setModalType] = useState<string>('')
  const [content, setContent] = useState<string>('')

  useEventSubscription<{ data: string; type: string }>({
    eventName: 'onOpenModal',
    callback: ({ data, type }) => {
      setIsOpen(true)
      setContent(data)
      setModalType(type)
    }
  })

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalType,
        content,
        setIsOpen
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within an ModalProvider')
  }
  return context
}
