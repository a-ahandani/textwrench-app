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
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'


let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
log.initialize()

app.whenReady().then(async () => {


  if (isDev) {
    // autoUpdater.autoDownload = false;
    autoUpdater.forceDevUpdateConfig = true;
  }

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


async function checkForUpdates() {
  autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.on('update-available', (version) => {
    log.info('Update available:', version)
    mainWindow?.webContents.send(IPC_EVENTS.UPDATE_AVAILABLE, version)
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded');
    mainWindow?.webContents.send(IPC_EVENTS.UPDATE_DOWNLOADED)
  })

  autoUpdater.on('error', (error) => {
    log.error('Update Error:', error)
    console.error('Update Error:', error)
  })
}


app.on('window-all-closed', () => {
  mainWindow = null
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
