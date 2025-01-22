import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerShortcut } from './services/shortcuts/shortcuts'
import { getMainWindow, initializeApp } from './services/window/window'
import { handleSelectedText } from './ipc/clipboard-handlers'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './store/helpers'
import { twService } from './services/axios/axios'
import { IPC_EVENTS } from '../shared/ipc-events'
import { verifyToken } from './services/auth/verifyToken'

app.whenReady().then(() => {
  const registerCopy = registerShortcut('Control+Shift+C', handleSelectedText)

  if (!registerCopy) {
    console.warn('Failed to simulate copy')
  }

  electronApp.setAppUserModelId('com.electron')

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('textwrench', process.execPath, [
        path.resolve(process.argv[1])
      ])
    }
  } else {
    app.setAsDefaultProtocolClient('textwrench')
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('open-url', (_, url) => {
    const urlParams = new URL(url)
    const token = urlParams.searchParams.get('token')
    const mainWindow = getMainWindow()

    if (token) {
      updateStore('token', token)
      twService.defaults.headers.common['Authorization'] = `Bearer ${token}`
      if (mainWindow) {
        mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
      }
    }
    if (!token && mainWindow) {
      mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
  })

  initializeApp()
  setupIpcHandlers()
  verifyToken()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeApp()
      verifyToken()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
