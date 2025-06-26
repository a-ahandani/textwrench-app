import { ChakraProvider } from '@renderer/components/providers/ChakraProvider'
import { ReactQueryProvider } from './components/providers/ReactQueryProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@renderer/components/providers/AuthProvider'
import { UpdateProvider } from './components/providers/UpdateProvider'
import { ModalProvider } from './components/providers/ModalProvider'
import { PromptsProvider } from './components/pages/prompts/components/PromptsContext'
import { RouteProvider } from './components/providers/RouteProvider'
import { SearchProvider } from './components/providers/SearchProvider'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <UpdateProvider>
        <AuthProvider>
          <ChakraProvider>
            <ReactQueryProvider>
              <RouteProvider defaultRoute="prompts">
                <ModalProvider>
                  <PromptsProvider>
                    <SearchProvider>
                      <App />
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
