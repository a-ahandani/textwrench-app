import { app, BrowserWindow } from 'electron'
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client'
import { electronApp } from '@electron-toolkit/utils'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './services/update-store'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { checkForUpdates } from './services/check-updates'
import { registerTextStreamIpc } from './services/process-text-stream'
import { handleOpenUrl } from './services/open-url'
import { APP_KEY, labels } from '@shared/constants'
import { checkPermissions } from './services/check-permissions'
import { initializeSettingsWindow, setIsQuitting } from './windows/settings'
import { initializeToolbarWindow } from './windows/toolbar'

let settingsWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
log.initialize()
log.transports.console.format = '{h}:{i}:{s} [{level}] {text}'
log.transports.console.level = `info`

app.whenReady().then(async () => {
  checkPermissions()
  initializeToolbarWindow()
  settingsWindow = initializeSettingsWindow()

  if (isDev) {
    // autoUpdater.autoDownload = false
    autoUpdater.forceDevUpdateConfig = true
  }

  await initializeAppSettings()
  setupProtocolHandling()
  setupSingleInstanceLock()
  checkForUpdates()
  setupIpcHandlers()
  registerTextStreamIpc()

  // Schedule periodic update checks (every 1 hour with small random jitter)
  const ONE_HOUR = 60 * 60 * 1000
  setInterval(() => {
    // Add up to 2 minutes jitter to avoid thundering herd on startup
    const jitter = Math.floor(Math.random() * 2 * 60 * 1000)
    setTimeout(() => {
      checkForUpdates().catch((err) => {
        log.error('Periodic update check failed:', err)
      })
    }, jitter)
  }, ONE_HOUR)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeSettingsWindow()
    }
  })
})

async function initializeAppSettings(): Promise<void> {
  const appVersion = await app.getVersion()
  log.info('App Version:', appVersion)
  updateStore('appVersion', appVersion)
  updateStore('delay', 50)

  electronApp.setAppUserModelId(labels.app)

  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(APP_KEY, process.execPath, [path.resolve(process.argv[1])])
  } else {
    app.setAsDefaultProtocolClient(APP_KEY)
  }
}

function setupProtocolHandling(): void {
  electronAppUniversalProtocolClient.on('request', async (requestUrl) => {
    if (requestUrl) handleOpenUrl(requestUrl)
  })

  electronAppUniversalProtocolClient.initialize({
    protocol: APP_KEY,
    mode: process.env.NODE_ENV === 'development' ? 'development' : 'production'
  })
}

function setupSingleInstanceLock(): void {
  if (process.platform !== 'win32') return

  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    setIsQuitting(true)
    app.quit()
    return
  }

  app.on('second-instance', (_, commandLine) => {
    if (settingsWindow) {
      if (settingsWindow.isMinimized()) settingsWindow.restore()
      settingsWindow.focus()
    }
    handleOpenUrl(commandLine.pop())
  })
}

app.on('window-all-closed', () => {
  settingsWindow = null
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
