import { app, BrowserWindow, dialog } from 'electron'
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initializeApp } from './services/window/window'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './store/helpers'
import { IPC_EVENTS } from '../shared/ipc-events'
import { APP_KEY } from '../shared/constants'
import { resetShortcuts } from './services/shortcuts/shortcuts'
import { autoUpdater } from 'electron-updater'

let mainWindow: BrowserWindow | null = null

app.whenReady().then(async () => {
  await initializeAppSettings()
  setupProtocolHandling()
  setupSingleInstanceLock()
  checkForUpdates()

  mainWindow = initializeApp()
  setupIpcHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeApp()
    }
  })
})

async function initializeAppSettings() {
  const appVersion = await app.getVersion()
  console.log('App Version:', appVersion)
  updateStore('appVersion', appVersion)
  resetShortcuts({})
  electronApp.setAppUserModelId('com.electron')

  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_KEY, process.execPath, [path.resolve(process.argv[1])])
  } else {
    app.setAsDefaultProtocolClient(APP_KEY)
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
}

function setupProtocolHandling() {
  electronAppUniversalProtocolClient.on('request', async (requestUrl) => {
    if (requestUrl) handleOpenUrl(requestUrl)
  })

  electronAppUniversalProtocolClient.initialize({
    protocol: APP_KEY,
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production'
  })
}

function setupSingleInstanceLock() {
  if (process.platform !== 'win32') return

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
    return
  }

  app.on('second-instance', (_, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    handleOpenUrl(commandLine.pop())
  })
}

function handleOpenUrl(url) {
  const urlParams = new URL(url)
  const token = urlParams.searchParams.get('token')

  if (token) {
    updateStore('token', token)
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED, { token })
  } else {
    mainWindow?.webContents.send(IPC_EVENTS.LOGIN_FULFILLED)
  }
}


function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. It will be downloaded in the background.',
      buttons: ['OK']
    })
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version has been downloaded. Restart the app to apply updates.',
      buttons: ['Restart Now', 'Later']
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('error', (error) => {
    console.error('Update Error:', error)
  })
}


app.on('window-all-closed', () => {
  mainWindow = null
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
