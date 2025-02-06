import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { registerShortcut } from './services/shortcuts/shortcuts'
import { initializeApp } from './services/window/window'
import { handleSelectedText } from './ipc/clipboard-handlers'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './store/helpers'
import { IPC_EVENTS } from '../shared/ipc-events'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  const APP_KEY = 'textwrench'

  const registerCopy = registerShortcut('Shift+Control+C', handleSelectedText)

  if (!registerCopy) {
    console.warn('Failed to simulate copy')
  }

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

  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (_event, argv) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        }
        mainWindow.focus()
      }
      console.log('argv------->', argv)
      const url = argv.find((arg) => arg.startsWith(`${APP_KEY}://`))
      if (url) {
        handleOpenUrl(url)
      }
    })

    app.on('ready', () => {
      mainWindow = initializeApp()
    })

    app.on('open-url', (event, url) => {
      event.preventDefault()
      handleOpenUrl(url)
    })
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
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
