import { is } from '@electron-toolkit/utils'
import { IPC_EVENTS } from '@shared/ipc-events'
import { app, BrowserWindow, ipcMain } from 'electron'
import { createDistanceMonitor, DistanceMonitor } from '../utils/distance-monitor'
import { info } from 'electron-log'
import { join } from 'path'
import { onSelection } from 'textwrench-observer'
import { makeProximityChecker } from '../utils/distance-monitor'

let toolbarWindow: BrowserWindow | undefined = undefined
let previousSelection: { text: string; timestamp: number } | null = null
const SELECTION_COOLDOWN_MS = 1000
const WIDTH = 302
const HEIGHT = 32
const MINIMUM_CHARACTER_LENGTH = 3

// Expansion state
let isExpanded = false
let activePanel: string | null = null
const DEFAULT_EXPANDED_WIDTH = Math.round(WIDTH * 4)
const DEFAULT_EXPANDED_HEIGHT = Math.round(HEIGHT * 10)

let distanceMonitor: DistanceMonitor | null = null

// Remember last user-expanded size so subsequent expansions restore it
let lastExpandedWidth = DEFAULT_EXPANDED_WIDTH
let lastExpandedHeight = DEFAULT_EXPANDED_HEIGHT

interface ExpandPayload {
  panel?: string
  action?: 'toggle' | 'open' | 'close'
  width?: number
  height?: number
}
// Proximity checker bound to current toolbar window reference
const isCursorNearToolbar = makeProximityChecker(() => toolbarWindow)
// Public helper so other modules (e.g., index.ts Space change listener) can force restart
export function restartDistanceMonitor(): void {
  distanceMonitor?.restart()
}

function collapseToolbar(): void {
  if (toolbarWindow && !toolbarWindow.isDestroyed()) {
    toolbarWindow.setSize(WIDTH, HEIGHT)
    isExpanded = false
    activePanel = null
  }
}

export function initializeToolbarWindow(): void {
  onSelection((selection) => {
    // only consider letters in the selection in any language
    const selectedText = selection.text.replace(/[^\p{L}\s]/gu, '').trim()
    info('------------>:', selection)

    const now = Date.now()

    if (selectedText && selectedText.length > MINIMUM_CHARACTER_LENGTH) {
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

      showToolbar(selection.text, selection.position.x, selection.position.y, selection.window)
    } else if (toolbarWindow) {
      // No immediate hide based on selection clearing; continuous distance monitor manages hiding
      if (!isCursorNearToolbar()) {
        // If user cleared selection and cursor already far, hide right away
        toolbarWindow.hide()
      }
    }
  })
}

function showToolbar(text: string, x: number, y: number, window): void {
  const position: { x: number; y: number } = {
    x: Math.round(x - WIDTH / 2),
    y: Math.round(y - 50)
  }

  if (toolbarWindow) {
    if (isExpanded) collapseToolbar()
    toolbarWindow.showInactive()
    toolbarWindow.setPosition(position.x, position.y)
    toolbarWindow.webContents.send(IPC_EVENTS.SET_SELECTED_TEXT, { text, position, window })
    // Always reset active panel on new selection so UI returns to compact state
    try {
      toolbarWindow.webContents.send(IPC_EVENTS.TOOLBAR_OPEN_PANEL, { panel: null })
    } catch {
      // ignore
    }
    distanceMonitor?.restart()
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
    resizable: false, // becomes true only when expanded
    skipTaskbar: true,
    focusable: false, // becomes focusable only when expanded for interaction & resizing
    show: false,
    minWidth: WIDTH,
    minHeight: HEIGHT,
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

  toolbarWindow.on('hide', () => {
    if (isExpanded) collapseToolbar()
    distanceMonitor?.stop()
    try {
      toolbarWindow?.webContents.send(IPC_EVENTS.TOOLBAR_RESET_UI)
    } catch {
      // ignore if webContents destroyed
    }
  })

  toolbarWindow.webContents.on('did-fail-load', (_, errorCode, errorDesc) => {
    console.error('Toolbar window failed to load:', errorCode, errorDesc)
  })

  toolbarWindow.on('ready-to-show', () => {
    toolbarWindow?.showInactive()
    toolbarWindow?.webContents.send(IPC_EVENTS.SET_SELECTED_TEXT, { text, position, window })
    // Initial mount also ensures panel is reset
    try {
      toolbarWindow?.webContents.send(IPC_EVENTS.TOOLBAR_OPEN_PANEL, { panel: null })
    } catch {
      // ignore
    }
    distanceMonitor?.restart()
  })

  ipcMain.on(IPC_EVENTS.TOOLBAR_EXPAND, (_event, raw?: ExpandPayload) => {
    if (!toolbarWindow || toolbarWindow.isDestroyed()) return
    const payload: ExpandPayload = raw || {}
    const { action = 'toggle', panel, width, height } = payload

    // Determine desired target state
    let nextExpanded = isExpanded
    if (action === 'toggle') {
      // If toggling a different panel than active, treat as open new panel
      if (panel && panel !== activePanel) {
        nextExpanded = true
      } else {
        nextExpanded = !isExpanded
      }
    } else if (action === 'open') {
      nextExpanded = true
    } else if (action === 'close') {
      nextExpanded = false
    }

    if (nextExpanded === isExpanded && panel && panel === activePanel && action !== 'toggle') {
      // No change required
      return
    }

    if (nextExpanded) {
      const targetWidth = width || lastExpandedWidth || DEFAULT_EXPANDED_WIDTH
      const targetHeight = height || lastExpandedHeight || DEFAULT_EXPANDED_HEIGHT
      const [, curH] = toolbarWindow.getSize()
      const deltaH = targetHeight - curH
      const [x, y] = toolbarWindow.getPosition()
      toolbarWindow.setPosition(x, y - deltaH)
      toolbarWindow.setSize(targetWidth, targetHeight, false)
      isExpanded = true
      activePanel = panel || activePanel || 'default'
      toolbarWindow.setResizable(true)
      toolbarWindow.setFocusable(true)
      // focus without stealing active app aggressively
      setTimeout(() => {
        try {
          toolbarWindow?.focus()
        } catch {
          // ignore focus errors
        }
      }, 10)
      distanceMonitor?.restart()
    } else {
      // collapse
      const [, curH] = toolbarWindow.getSize()
      const deltaH = curH - HEIGHT
      const [x, y] = toolbarWindow.getPosition()
      toolbarWindow.setPosition(x, y + deltaH)
      toolbarWindow.setSize(WIDTH, HEIGHT, false)
      isExpanded = false
      activePanel = null
      toolbarWindow.setResizable(false)
      toolbarWindow.setFocusable(false)
      distanceMonitor?.restart()
    }
  })

  // Panel open/close notification from renderer -> rebroadcast to renderer subscription API
  ipcMain.on(IPC_EVENTS.TOOLBAR_OPEN_PANEL, (_event, data: { panel?: string | null }) => {
    if (!toolbarWindow || toolbarWindow.isDestroyed()) return
    activePanel = data?.panel ?? null
    try {
      toolbarWindow.webContents.send(IPC_EVENTS.TOOLBAR_OPEN_PANEL, { panel: activePanel })
    } catch {
      // ignore if webContents gone
    }
  })

  // Track manual user resize when expanded to persist for future expansions
  toolbarWindow.on('resize', () => {
    if (!toolbarWindow || toolbarWindow.isDestroyed()) return
    if (!isExpanded) return
    const [w, h] = toolbarWindow.getSize()
    // Basic guards to avoid absurd values
    if (w >= WIDTH && h >= HEIGHT) {
      lastExpandedWidth = w
      lastExpandedHeight = h
    }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    toolbarWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/toolbar.html`)
  } else {
    const appPath = app.getAppPath()
    toolbarWindow.loadFile(join(appPath, 'out/renderer/toolbar.html'))
  }

  // Initialize distance monitor (only once per window creation)
  distanceMonitor = createDistanceMonitor({
    getWindow: () => toolbarWindow,
    skipHidePredicate: () => isExpanded,
    onFar: (win) => {
      try {
        win.hide()
      } catch {
        // ignore
      }
    }
  })
  distanceMonitor.start()
}

export const getToolbarWindow = (): BrowserWindow | undefined => {
  return toolbarWindow
}
