import { ChakraProvider } from '@renderer/components/providers/ChakraProvider'
import { ReactQueryProvider } from '../providers/ReactQueryProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import SettingsApp from './Settings'
import { AuthProvider } from '@renderer/components/providers/AuthProvider'
import { UpdateProvider } from '../providers/UpdateProvider'
import { ModalProvider } from '../providers/ModalProvider'
import { RouteProvider } from '../providers/RouteProvider'
import { SearchProvider } from '../providers/SearchProvider'
import { PromptsProvider } from './pages/prompts/components/PromptsContext'

const settingsRootElement = document.getElementById('settings')
if (settingsRootElement) {
  ReactDOM.createRoot(settingsRootElement).render(
    <React.StrictMode>
      <UpdateProvider>
        <AuthProvider>
          <ChakraProvider>
            <ReactQueryProvider>
              <RouteProvider defaultRoute="prompts">
                <ModalProvider>
                  <PromptsProvider>
                    <SearchProvider>
                      <SettingsApp />
                    </SearchProvider>
                  </PromptsProvider>
                </ModalProvider>
              </RouteProvider>
            </ReactQueryProvider>
          </ChakraProvider>
        </AuthProvider>
      </UpdateProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
