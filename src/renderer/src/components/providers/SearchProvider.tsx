import React, { createContext, useContext, ReactNode, useState } from 'react'
import { useRoute } from './RouteProvider'

type SearchContextType = {
  searchTerm: string
  setSearchTerm: (term: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

type SearchProviderProps = {
  children: ReactNode
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState({})

  const { activeRoute } = useRoute()
  return (
    <SearchContext.Provider
      value={{
        searchTerm: searchTerm[activeRoute] || '',
        setSearchTerm: (term: string) => setSearchTerm((prev) => ({ ...prev, [activeRoute]: term }))
      }}
    >
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
