import { is } from '@electron-toolkit/utils'
import { IPC_EVENTS } from '@shared/ipc-events'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import { onSelection } from 'textwrench-observer'

let toolbarWindow: BrowserWindow | undefined = undefined
let hideToolbarWindowTimeout: NodeJS.Timeout | null = null

let previousSelection: { text: string; timestamp: number } | null = null
const SELECTION_COOLDOWN_MS = 1000
// const WIDTH = 205
const WIDTH = 120
const HEIGHT = 25
const MINIMUM_CHARACTER_LENGTH = 3

export function initializeToolbarWindow(): void {
  onSelection((selection) => {
    // only consider letters in the selection in any language
    const selectedText = selection.text.replace(/[^\p{L}\s]/gu, '').trim()
    console.debug('Toolbar selection:', selectedText, selection)

    const now = Date.now()

    if (selectedText && selectedText.length > MINIMUM_CHARACTER_LENGTH) {
      if (!selection.modifiers?.includes('option')) {
        return
      }
      if (
        previousSelection &&
        previousSelection.text === selectedText &&
        now - previousSelection.timestamp < SELECTION_COOLDOWN_MS
      ) {
        return
      }

      previousSelection = {
        text: selectedText,
        timestamp: now
      }

      if (hideToolbarWindowTimeout) {
        clearTimeout(hideToolbarWindowTimeout)
        hideToolbarWindowTimeout = null
      }
      showToolbar(selection.text, selection.position.x, selection.position.y, selection.window)
    } else if (toolbarWindow && !hideToolbarWindowTimeout) {
      hideToolbarWindowTimeout = setTimeout(() => {
        if (toolbarWindow && !toolbarWindow.isDestroyed()) {
          toolbarWindow.hide()
        }
        hideToolbarWindowTimeout = null
      }, 500)
    }
  })
}

function showToolbar(text: string, x: number, y: number, window): void {
  const position: { x: number; y: number } = {
    x: Math.round(x - WIDTH / 2),
    y: Math.round(y - 50)
  }

  if (toolbarWindow) {
    toolbarWindow.showInactive()
    // animateWindowResize(toolbarWindow, WIDTH * 2, HEIGHT * Math.random() * 2 + 1, 200)

    toolbarWindow.setPosition(position.x, position.y)
    toolbarWindow.webContents.send(IPC_EVENTS.SET_SELECTED_TEXT, {
      text,
      position,
      window
    })
    return
  }

  toolbarWindow = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    x: position.x,
    y: position.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    focusable: false,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true
    }
  })

  toolbarWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  toolbarWindow.setAlwaysOnTop(true, 'screen-saver', 1)
  toolbarWindow.on('close', (e) => {
    e.preventDefault()
    toolbarWindow?.hide()
  })

  toolbarWindow.webContents.on('did-fail-load', (_, errorCode, errorDesc) => {
    console.error('Toolbar window failed to load:', errorCode, errorDesc)
  })

  toolbarWindow.on('ready-to-show', () => {
    toolbarWindow?.showInactive()
    toolbarWindow?.webContents.send(IPC_EVENTS.SET_SELECTED_TEXT, {
      text,
      position,
      window
    })
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    toolbarWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/toolbar.html`)
  } else {
    toolbarWindow.loadFile(join(__dirname, '../renderer/toolbar.html'))
  }
}

export const getToolbarWindow = (): BrowserWindow | undefined => {
  return toolbarWindow
}
