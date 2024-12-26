import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerShortcut } from './services/shortcuts/shortcuts'
import { initializeApp } from './services/window/window'
import { handleSelectedText } from './services/ipc/clipboard-handlers'

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

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) initializeApp()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
