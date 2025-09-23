import React, { createContext, useContext, ReactNode, useState } from 'react'

type SearchContextType = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

type SearchProviderProps = {
  children: ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within an SearchProvider')
  }
  return context
}
