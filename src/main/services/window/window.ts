import { app, BrowserWindow, Menu, shell, Tray } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import macIcon from '../../../../resources/macos/AppIcon.icns?asset'
import winIcon from '../../../../resources/web/icon-512-maskable.png?asset'

import icon24 from '../../../../resources/icon24.png?asset'

let tray: Tray | null = null

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
    event.preventDefault()
    mainWindow.hide()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  function createTray() {
    tray = new Tray(icon24)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          if (mainWindow) {
            mainWindow.show()
          }
        }
      },
      {
        label: 'Quit',
        click: () => {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.destroy()
          })
          app.quit()
        }
      }
    ])

    tray.setToolTip('TextWrench')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      if (mainWindow) {
        mainWindow.show()
      }
    })
  }

  return mainWindow
}

export const getMainWindow = (): BrowserWindow | null => {
  return BrowserWindow.getAllWindows()[0] || null
}
