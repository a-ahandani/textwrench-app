/* eslint-disable react-refresh/only-export-components */
import { useStore } from '@renderer/hooks/useStore'
import { Prompt } from '@shared/types/store'
import { createContext, useContext, useState } from 'react'

interface PromptContextType {
  editingId: string | null | 'new'
  defaultPrompt: Prompt | null
  setDefaultPrompt: (prompt: Prompt) => void
  setEditingId: (id: string | null) => void
}

export const PromptContext = createContext<PromptContextType | undefined>(undefined)

import { ReactNode } from 'react'

interface PromptsProviderProps {
  children: ReactNode
}

export const PromptsProvider = ({ children }: PromptsProviderProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)

  const { setValue: setDefaultPrompt, value: defaultPrompt } = useStore<Prompt>({
    key: 'selectedPrompt'
  })

  return (
    <PromptContext.Provider
      value={{
        defaultPrompt,
        setDefaultPrompt,
        editingId,
        setEditingId
      }}
    >
      {children}
    </PromptContext.Provider>
  )
}

export const usePromptsContext = () => {
  const context = useContext(PromptContext)
  if (!context) {
    throw new Error('usePromptsContext must be used within a PromptsProvider')
  }
  return context
}
