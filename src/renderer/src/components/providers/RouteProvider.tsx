import React, { createContext, useContext, ReactNode, useState } from 'react'
import { GoGear, GoBookmark, GoBook, GoTools } from 'react-icons/go'
import { Prompts } from '../pages/prompts/Prompts'
import { Templates } from '../pages/templates/Templates'
import { Settings } from '../pages/settings/Settings'
import { About } from '../pages/about/About'
import { useAuth } from './AuthProvider'

type RouteType = {
  value: string
  icon: ReactNode
  content: ReactNode
  isProtected: boolean
}

type RouteContextType = {
  routes: RouteType[]
  activeRoute: string
  setCurrentRoute: (route: string) => void
  visibleRoutes: RouteType[]
}

const RouteContext = createContext<RouteContextType | undefined>(undefined)

type RouteProviderProps = {
  children: ReactNode
  defaultRoute: string
}

const routes = [
  { value: 'prompts', icon: <GoBookmark />, content: <Prompts />, isProtected: true },
  { value: 'templates', icon: <GoBook />, content: <Templates />, isProtected: true },
  { value: 'settings', icon: <GoGear />, content: <Settings />, isProtected: false },
  { value: 'about', icon: <GoTools />, content: <About />, isProtected: false }
]

export const RouteProvider: React.FC<RouteProviderProps> = ({ children, defaultRoute }) => {
  const [activeRoute, setCurrentRoute] = useState(defaultRoute)
  const { isLoggedIn } = useAuth()
  const visibleRoutes = routes.filter((tab) => !tab.isProtected || isLoggedIn)

  return (
    <RouteContext.Provider
      value={{
        routes,
        visibleRoutes,
        activeRoute,
        setCurrentRoute
      }}
    >
      {children}
    </RouteContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext)
  if (!context) {
    throw new Error('useRoute must be used within an RouteProvider')
  }
  return context
}
