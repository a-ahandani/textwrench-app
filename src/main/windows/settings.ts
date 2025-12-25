import { app, BrowserWindow, Menu, shell, Tray } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import macIcon from '../../../resources/icons/icon.icns?asset'
import winIcon from '../../../resources/icons/icon.png?asset'
import trayIcon from '../../../build/tray/icon-w.png?asset'
import trayIconColored from '../../../build/tray/icon-win.png?asset'
import { labels } from '../../shared/constants'
import { checkForUpdates } from '../services/check-updates'
import log from 'electron-log'
import { getToolbarWindow } from './toolbar'
import { store } from '../providers/store'
import { bringToFront } from '../services/set-focus'

// Constants
const SETTINGS_WINDOW_BOUNDS = {
  x: 10,
  y: 10,
  width: 780,
  height: 480
}

const PLATFORM_SETTINGS = {
  darwin: {
    icon: macIcon
  },
  linux: {
    icon: winIcon
  },
  win32: {
    icon: winIcon
  }
} as const

// Module state
let tray: Tray | null = null
let settingsWindow: BrowserWindow | null = null
let isQuitting = false
let shouldShowOnReady = false
let firstReadyHandled = false

// Public API
export const getIsQuitting = (): boolean => isQuitting
export const setIsQuitting = (value: boolean): void => {
  isQuitting = value
}

export const getSettingsWindow = (): BrowserWindow | null => {
  return settingsWindow
}

export const showSettingsWindowExplicitly = (): void => {
  showSettingsWindow()
}

/**
 * Initializes and returns the settings window
 * Reuses existing window if one already exists
 */
export function initializeSettingsWindow(shouldShow = false): BrowserWindow {
  if (settingsWindow && !settingsWindow.isDestroyed()) return settingsWindow

  shouldShowOnReady = shouldShow
  createSettingsWindow()
  setupWindowEventHandlers()
  loadWindowContent()
  createTray()

  return settingsWindow!
}

/**
 * Creates the settings window with platform-specific configuration
 */
function createSettingsWindow(): void {
  settingsWindow = new BrowserWindow({
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: true,
    skipTaskbar: true,
    focusable: true,
    maximizable: false,
    autoHideMenuBar: true,
    ...PLATFORM_SETTINGS[process.platform as keyof typeof PLATFORM_SETTINGS],
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  settingsWindow.setBounds(SETTINGS_WINDOW_BOUNDS)
  if (process.platform === 'darwin') {
    settingsWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: false })
  } else {
    settingsWindow.setVisibleOnAllWorkspaces(true)
  }
}

/**
 * Sets up event handlers for the settings window
 */
function setupWindowEventHandlers(): void {
  if (!settingsWindow) return

  settingsWindow.on('focus', () => {
    void checkForUpdates({ source: 'focus' }).catch((err) => {
      log.error('Focus update check failed:', err)
    })
  })

  settingsWindow.on('ready-to-show', () => {
    // Show if explicitly requested
    if (shouldShowOnReady) {
      settingsWindow?.show()
      shouldShowOnReady = false
    }

    if (!firstReadyHandled) {
      firstReadyHandled = true
      // If there's no auth token yet, surface the window to user for login
      try {
        const token = store.get('token')
        if (!token) {
          bringToFront()
        }
      } catch {
        // ignore store access errors
      }
    }
  })

  settingsWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  settingsWindow.on('close', handleWindowClose)

  app.on('before-quit', handleAppQuit)
}

/**
 * Handles the window close event
 */
function handleWindowClose(event: Electron.Event): void {
  if (!getIsQuitting()) {
    event.preventDefault()
    app.dock?.hide()
    settingsWindow?.hide()
  }
}

/**
 * Handles application quit cleanup
 */
function handleAppQuit(): void {
  setIsQuitting(true)
  getToolbarWindow()?.destroy()
  tray?.destroy()
}

/**
 * Loads the appropriate content into the window
 */
function loadWindowContent(): void {
  if (!settingsWindow) return

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    settingsWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    const appPath = app.getAppPath()
    settingsWindow.loadFile(join(appPath, 'out/renderer/index.html'))
  }
}

/**
 * Creates the system tray icon and menu
 */
function createTray(): void {
  try {
    const iconPath = getTrayIconPath()
    tray = new Tray(iconPath)

    setupTrayContextMenu()
    setupTrayClickHandler()

    tray.setToolTip(labels.app)
  } catch (error) {
    log.error('Error creating tray', error)
  }
}

/**
 * Returns the appropriate tray icon path based on platform
 */
function getTrayIconPath(): string {
  return process.platform === 'win32' ? trayIconColored : trayIcon
}

/**
 * Sets up the context menu for the tray icon
 */
function setupTrayContextMenu(): void {
  if (!tray) return

  const contextMenu = Menu.buildFromTemplate([
    {
      label: labels.showApp,
      click: showSettingsWindow
    },
    {
      label: labels.quit,
      click: quitApplication
    }
  ])

  tray.setContextMenu(contextMenu)
}

/**
 * Sets up the click handler for the tray icon
 */
function setupTrayClickHandler(): void {
  if (!tray) return

  tray.on('click', showSettingsWindow)
}

/**
 * Shows the settings window if it exists
 */
function showSettingsWindow(): void {
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    shouldShowOnReady = true
    settingsWindow.show()
  } else {
    // Initialize and show if window doesn't exist
    initializeSettingsWindow(true)
  }
}

/**
 * Quits the application, destroying all windows
 */
function quitApplication(): void {
  BrowserWindow.getAllWindows().forEach((window) => window.destroy())
  app.quit()
}
