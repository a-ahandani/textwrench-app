import { getSettingsWindow, showSettingsWindowExplicitly } from '../windows/settings'
import { exec } from 'child_process'
import type { BrowserWindow } from 'electron'

// Throttling state
let lastAggressiveTs = 0
let lastPassiveTs = 0
const PASSIVE_THROTTLE_MS = 800
const AGGRESSIVE_THROTTLE_MS = 1500

interface FocusOptions {
  aggressive?: boolean // aggressive steals focus; passive only shows if hidden/minimized
  window?: BrowserWindow | null
  reason?: string
}

function shouldThrottle(now: number, aggressive: boolean): boolean {
  if (aggressive) return now - lastAggressiveTs < AGGRESSIVE_THROTTLE_MS
  return now - lastPassiveTs < PASSIVE_THROTTLE_MS
}

/**
 * Unified focus helper.
 * Passive: surfaces window without stealing active focus.
 * Aggressive: replicates legacy bringToFront behavior (show + focus + top hack).
 */
export function requestAppFocus(opts: FocusOptions = {}): void {
  const { aggressive = false } = opts
  const now = Date.now()
  if (shouldThrottle(now, aggressive)) return

  let targetWindow = opts.window || getSettingsWindow()
  if (!targetWindow) {
    // Create window if missing. Only aggressively proceed if requested.
    showSettingsWindowExplicitly()
    targetWindow = getSettingsWindow()
    if (!targetWindow) return
  }

  if (aggressive) {
    lastAggressiveTs = now
    performAggressiveFocus(targetWindow)
    return
  }

  lastPassiveTs = now
  try {
    if (targetWindow.isMinimized()) targetWindow.restore()
    if (!targetWindow.isVisible()) targetWindow.showInactive()
  } catch {
    /* ignore */
  }
}

// Legacy aggressive focus sequence extracted for clarity.
function performAggressiveFocus(targetWindow: BrowserWindow): void {
  try {
    if (targetWindow.isMinimized()) targetWindow.restore()
    targetWindow.show()
    targetWindow.focus()
    // Temporary always-on-top flip attempts to force z-order raise; may be removed later.
    targetWindow.setAlwaysOnTop(true)
    targetWindow.setAlwaysOnTop(false)

    if (process.platform === 'win32') {
      const title = targetWindow.getTitle().replace(/'/g, "''")
      exec(
        `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
        (err) => {
          if (err) console.error('AppActivate failed:', err)
        }
      )
    }
  } catch (e) {
    console.error('Aggressive focus failed', e)
  }
}

// Backwards compatibility export – prefer requestAppFocus going forward.
export const bringToFront = (window: BrowserWindow | null = null): void => {
  requestAppFocus({ aggressive: true, window })
}

export const bringToFrontWindows = (): void => {
  const targetWindow = getSettingsWindow()
  if (!targetWindow) return
  requestAppFocus({ aggressive: true, window: targetWindow })
}
