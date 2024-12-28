import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerShortcut } from './services/shortcuts/shortcuts'
import { initializeApp } from './services/window/window'
import { handleSelectedText } from './ipc/clipboard-handlers'
import { setupIpcHandlers } from './ipc/handlers'
import { initializePromptOptions } from './services/ai/prompts'

app.whenReady().then(() => {
  const registerCopy = registerShortcut('Control+Shift+C', handleSelectedText)

  if (!registerCopy) {
    console.warn('Failed to simulate copy')
  }

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  initializeApp()
  initializePromptOptions()
  setupIpcHandlers()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initializeApp()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
