import { app, BrowserWindow, Menu, shell, Tray } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import macIcon from '../../../../resources/icons/icon.icns?asset'
import winIcon from '../../../../resources/icons/icon.png?asset'
import trayIcon from '../../../../build/tray/icon-w.png?asset'
import trayIconColored from '../../../../build/tray/icon-win.png?asset'
import { labels } from '../../../shared/constants'

let tray: Tray | null = null
let isQuitting = false

const platformSettings = {
  darwin: {
    icon: macIcon
  },
  linux: {
    icon: winIcon
  },
  win32: {
    icon: winIcon
  }
}
export const initializeApp = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: true,
    maximizable: false,
    autoHideMenuBar: true,
    ...platformSettings[process.platform],
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  createTray()

  mainWindow.setBounds({ x: 10, y: 10, width: 480, height: 320 })
  mainWindow.setVisibleOnAllWorkspaces(true)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('close', function (event) {
    if (!isQuitting) {
      event.preventDefault()
      app.dock?.hide()
      mainWindow.hide()
    }
  })
  app.on('before-quit', () => {
    isQuitting = true
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  function createTray() {
    try {
      const initialTrayIcon = process.platform === 'win32' ? trayIconColored : trayIcon
      tray = new Tray(initialTrayIcon)

      const contextMenu = Menu.buildFromTemplate([
        {
          label: labels.showApp,
          click: () => {
            if (mainWindow) {
              mainWindow.show()
            }
          }
        },
        {
          label: labels.quit,
          click: () => {
            BrowserWindow.getAllWindows().forEach((window) => {
              window.destroy()
            })
            app.quit()
          }
        }
      ])

      tray.setToolTip(labels.app)
      tray.setContextMenu(contextMenu)

      tray.on('click', () => {
        if (mainWindow) {
          mainWindow.show()
        }
      })
    } catch (error) {
      console.log('Error creating tray', error)
    }
  }

  return mainWindow
}

export const getMainWindow = (): BrowserWindow | null => {
  return BrowserWindow.getAllWindows()[0] || null
}
