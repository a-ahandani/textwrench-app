import { app, BrowserWindow } from 'electron'
import { electronAppUniversalProtocolClient } from 'electron-app-universal-protocol-client'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { initializeApp, setIsQuitting } from './services/window/window'
import { setupIpcHandlers } from './ipc/handlers'
import path from 'path'
import { updateStore } from './store/helpers'
import { resetShortcuts } from './services/shortcuts/shortcuts'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { checkForUpdates } from './services/updater/updater'
import { handleOpenUrl } from './services/url/url'
import { APP_KEY, labels } from '@shared/constants'
import { checkPermissions } from './services/permissions/permissions'
import { getBinaryPath } from 'textwrench-hotkeys'

import { connectToGoPipe } from './services/windows-pipe/websocket'
import { spawn } from 'child_process'

let mw: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
log.initialize()
log.transports.console.format = '{h}:{i}:{s} [{level}] {text}'
log.transports.console.level = `info`

app.commandLine.appendSwitch('enable-features', 'GlobalShortcutsPortal')

let hotkeyProc: ReturnType<typeof spawn> | null = null

app.whenReady().then(() => {
  if (process.platform === 'win32') {
    startHotkeyHandler()
  }
})

function startHotkeyHandler() {
  const binaryPath = getBinaryPath()

  hotkeyProc = spawn(binaryPath, [], {
    stdio: 'pipe',
    windowsHide: true
  })

  hotkeyProc.stdout?.on('data', (data) => {
    log.info(`[hotkey stdout]: ${data.toString().trim()}`)
  })

  hotkeyProc.stderr?.on('data', (data) => {
    log.error(`[hotkey stderr]: ${data.toString().trim()}`)
  })

  hotkeyProc.on('close', (code) => {
    log.warn(`hotkey process exited with code ${code}`)
  })

  hotkeyProc.on('error', (err) => {
    log.error(`Failed to start hotkey process:`, err)
  })
}

app.on('before-quit', () => {
  if (hotkeyProc) {
    hotkeyProc.kill()
    hotkeyProc = null
  }
})

app.whenReady().then(async () => {
  checkPermissions()
  connectToGoPipe()
  mw = initializeApp()
  if (isDev) {
    // autoUpdater.autoDownload = false
    autoUpdater.forceDevUpdateConfig = true
  }

  await initializeAppSettings()
  setupProtocolHandling()
  setupSingleInstanceLock()
  checkForUpdates()
  setupIpcHandlers()
  resetShortcuts({})

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      initializeApp()
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

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
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
    if (mw) {
      if (mw.isMinimized()) mw.restore()
      mw.focus()
    }
    handleOpenUrl(commandLine.pop())
  })
}

app.on('window-all-closed', () => {
  mw = null
  // Do not quit the app when all windows are closed
  // The app will remain running in the background
})
