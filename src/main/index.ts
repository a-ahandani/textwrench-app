import { app, BrowserWindow } from 'electron'
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initializeApp } from './services/window/window'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './store/helpers'
import { IPC_EVENTS } from '../shared/ipc-events'
import { APP_KEY } from '../shared/constants'
import { resetShortcuts } from './services/shortcuts/shortcuts'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(async () => {
  const appVersion = await app.getVersion()
  updateStore('appVersion', appVersion)
  resetShortcuts({})
  electronApp.setAppUserModelId('com.electron')

  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(APP_KEY, process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient(APP_KEY)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  electronAppUniversalProtocolClient.on('request', async (requestUrl) => {
    if (requestUrl) {
      handleOpenUrl(requestUrl)
    }
  })

  await electronAppUniversalProtocolClient.initialize({
    protocol: APP_KEY,
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production'
  })

  if (process.platform === 'win32') {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('second-instance', (_, commandLine) => {
        if (mainWindow) {
          if (mainWindow.isMinimized()) mainWindow.restore()
          mainWindow.focus()
        }
        handleOpenUrl(commandLine.pop())
      })

      app.whenReady().then(() => {
        initializeApp()
      })
    }
  }

  function handleOpenUrl(url) {
    const urlParams = new URL(url)
    const token = urlParams.searchParams.get('token')

    if (token) {
      updateStore('token', token)
      if (mainWindow) {
        mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
      }
    } else if (mainWindow) {
      mainWindow.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
    }
  }

  mainWindow = initializeApp()
  setupIpcHandlers()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeApp()
    }
  })
})

app.on('window-all-closed', () => {
  mainWindow = null
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
