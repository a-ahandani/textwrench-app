import { ChakraProvider } from '@renderer/components/providers/ChakraProvider'
import { ReactQueryProvider } from './components/providers/ReactQueryProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from '@renderer/components/providers/AuthProvider'

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AuthProvider>
        <ChakraProvider>
          <ReactQueryProvider>
            <App />
          </ReactQueryProvider>
        </ChakraProvider>
      </AuthProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
