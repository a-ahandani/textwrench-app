import { ChakraProvider } from '@renderer/components/providers/ChakraProvider'
import { ReactQueryProvider } from '../providers/ReactQueryProvider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from '@renderer/components/providers/AuthProvider'
import { UpdateProvider } from '../providers/UpdateProvider'
import { SelectedTextProvider } from '../providers/SelectedTextProvider'
import ToolbarApp from './Toolbar'

const toolbarRootElement = document.getElementById('toolbar')
if (toolbarRootElement) {
  ReactDOM.createRoot(toolbarRootElement).render(
    <React.StrictMode>
      <UpdateProvider>
        <AuthProvider>
          <ChakraProvider>
            <ReactQueryProvider>
              <SelectedTextProvider>
                <ToolbarApp />
              </SelectedTextProvider>
            </ReactQueryProvider>
          </ChakraProvider>
        </AuthProvider>
      </UpdateProvider>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}
