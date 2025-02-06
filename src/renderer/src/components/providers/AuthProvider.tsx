import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { login, logout, onLoggedIn, verifyToken } = window.api

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = () => {
    setIsLoading(true)
    login()
  }

  const handleLogout = () => {
    setIsLoading(true)
    logout()
    setIsLoggedIn(false)
    setIsLoading(false)
  }
  useEffect(() => {
    verifyToken()
    onLoggedIn((data) => {
      setIsLoading(false)
      if (data?.token) {
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
