import { is } from '@electron-toolkit/utils'
import { IPC_EVENTS } from '@shared/ipc-events'
import { app, BrowserWindow, ipcMain, screen } from 'electron'
import { createDistanceMonitor, DistanceMonitor } from '../utils/distance-monitor'
import { info } from 'electron-log'
import { join } from 'path'
import { onSelection } from 'textwrench-observer'
import { makeProximityChecker } from '../utils/distance-monitor'
import { getSettingsWindow } from './settings'

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

function safeHide(): void {
  if (!toolbarWindow || toolbarWindow.isDestroyed()) return
  try {
    toolbarWindow.hide()
  } catch {
    /* ignore */
  }
}

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
    toolbarWindow.setResizable(false)
    toolbarWindow.setFocusable(false)
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
      // If selection cleared and cursor already far, hide promptly.
      if (!isCursorNearToolbar()) safeHide()
    }
  })
}

function clampPosition(pos: { x: number; y: number }): { x: number; y: number } {
  try {
    const display = screen.getDisplayNearestPoint({ x: pos.x, y: pos.y })
    const { x: dx, y: dy, width: dw, height: dh } = display.workArea
    return {
      x: Math.min(Math.max(pos.x, dx), dx + dw - WIDTH),
      y: Math.min(Math.max(pos.y, dy), dy + dh - HEIGHT)
    }
  } catch {
    return pos
  }
}

function ensureZOrder(win: BrowserWindow | undefined): void {
  if (!win || win.isDestroyed()) return
  try {
    win.setAlwaysOnTop(true, 'screen-saver', 1)
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  } catch {
    /* ignore */
  }
}

function hideSettingsWindowOnToolbarOpen(): void {
  const settingsWindow = getSettingsWindow()
  if (!settingsWindow || settingsWindow.isDestroyed()) return
  try {
    if (settingsWindow.isVisible()) settingsWindow.hide()
  } catch {
    /* ignore */
  }
}

function showToolbar(text: string, x: number, y: number, window): void {
  hideSettingsWindowOnToolbarOpen()
  let position: { x: number; y: number } = {
    x: Math.round(x - WIDTH / 2),
    y: Math.round(y - 50)
  }
  position = clampPosition(position)

  if (toolbarWindow) {
    if (isExpanded) collapseToolbar()
    ensureZOrder(toolbarWindow)
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
  ensureZOrder(toolbarWindow)
  toolbarWindow.on('close', (e) => {
    e.preventDefault()
    toolbarWindow?.hide()
  })

  toolbarWindow.on('hide', () => {
    if (isExpanded) collapseToolbar()
    distanceMonitor?.stop()
    // Double-check hide if compositor delay leaves it visible momentarily
    setTimeout(() => {
      try {
        if (toolbarWindow && !toolbarWindow.isDestroyed() && toolbarWindow.isVisible()) {
          safeHide()
          setTimeout(() => safeHide(), 120)
        }
      } catch {
        /* ignore */
      }
    }, 120)
    try {
      toolbarWindow?.webContents.send(IPC_EVENTS.TOOLBAR_RESET_UI)
    } catch {
      /* ignore */
    }
  })

  toolbarWindow.webContents.on('did-fail-load', (_, errorCode, errorDesc) => {
    console.error('Toolbar window failed to load:', errorCode, errorDesc)
  })

  toolbarWindow.on('ready-to-show', () => {
    ensureZOrder(toolbarWindow)
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
      // Keep toolbar visible without activating the app (avoid Space switching).
      setTimeout(() => {
        try {
          if (!toolbarWindow || toolbarWindow.isDestroyed()) return
          if (!toolbarWindow.isVisible()) toolbarWindow.showInactive()
        } catch {
          // ignore visibility errors
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
  // Distance monitor will now always hide the toolbar when the cursor is far,
  // even if it is expanded. Previous logic skipped hiding while expanded which
  // could leave the UI lingering indefinitely if the user moved away without
  // explicitly closing it. We first collapse (to persist sizing state safely)
  // then hide the window for a smoother UX.
  distanceMonitor = createDistanceMonitor({
    getWindow: () => toolbarWindow,
    // Slightly larger threshold gives the user a small buffer while interacting.
    threshold: 110,
    onFar: (win) => {
      try {
        if (isExpanded) collapseToolbar()
        win.hide()
        // Proactive visibility re-check shortly after initiating hide
        setTimeout(() => {
          try {
            if (win.isVisible()) win.hide()
          } catch {
            /* ignore */
          }
        }, 80)
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

export const getToolbarState = (): { isExpanded: boolean; activePanel: string | null } => {
  return { isExpanded, activePanel }
}
