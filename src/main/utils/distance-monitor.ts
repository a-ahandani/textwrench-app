import { BrowserWindow, screen } from 'electron'

export interface DistanceMonitorOptions {
  /** Function returning the window we track */
  getWindow: () => BrowserWindow | undefined | null
  /** Threshold in px considered still "near" */
  threshold?: number
  /** Polling interval for distance checks */
  pollIntervalMs?: number
  /** Interval for watchdog (stale detection) */
  watchdogIntervalMs?: number
  /** If no poll tick recorded for more than this ms we consider stale */
  staleHideAfterMs?: number
  /** Called when cursor is far */
  onFar?: (win: BrowserWindow) => void
  /** Called when cursor is near (optional) */
  onNear?: (win: BrowserWindow) => void
  /** If true, watchdog will auto-hide only when window is visible */
  hideOnlyWhenVisible?: boolean
  /** Skip hiding while this predicate returns true (e.g. expanded state) */
  skipHidePredicate?: () => boolean
}

/**
 * Generic reusable cursor distance monitor with optional stale watchdog.
 * No external dependencies. Can be reused by any window needing auto-hide behavior.
 */
export class DistanceMonitor {
  private opts: Required<
    Omit<DistanceMonitorOptions, 'skipHidePredicate' | 'onFar' | 'onNear' | 'getWindow'>
  > & {
    skipHidePredicate?: () => boolean
    onFar?: (win: BrowserWindow) => void
    onNear?: (win: BrowserWindow) => void
    getWindow: () => BrowserWindow | undefined | null
  }
  private pollTimer: NodeJS.Timeout | null = null
  private watchdogTimer: NodeJS.Timeout | null = null
  private lastTick = Date.now()

  constructor(options: DistanceMonitorOptions) {
    this.opts = {
      threshold: options.threshold ?? 90,
      pollIntervalMs: options.pollIntervalMs ?? 250,
      watchdogIntervalMs: options.watchdogIntervalMs ?? 250,
      staleHideAfterMs: options.staleHideAfterMs ?? 600,
      hideOnlyWhenVisible: options.hideOnlyWhenVisible ?? true,
      skipHidePredicate: options.skipHidePredicate,
      onFar: options.onFar,
      onNear: options.onNear,
      getWindow: options.getWindow
    }
  }

  private isCursorNear(win: BrowserWindow): boolean {
    return isCursorNearWindow(win, this.opts.threshold)
  }

  start(): void {
    this.stop()
    // Poll timer
    this.pollTimer = setInterval(() => {
      const win = this.opts.getWindow()
      if (!win || win.isDestroyed()) return
      const near = this.isCursorNear(win)
      this.lastTick = Date.now()
      if (near) {
        this.opts.onNear?.(win)
      } else {
        if (this.opts.skipHidePredicate?.()) return
        this.opts.onFar?.(win)
      }
    }, this.opts.pollIntervalMs)

    // Watchdog
    this.watchdogTimer = setInterval(() => {
      const win = this.opts.getWindow()
      if (!win || win.isDestroyed()) return
      if (this.opts.skipHidePredicate?.()) return
      if (this.opts.hideOnlyWhenVisible && !win.isVisible()) return
      const elapsed = Date.now() - this.lastTick
      if (elapsed > this.opts.staleHideAfterMs) {
        // Re-evaluate distance before hiding
        if (!this.isCursorNear(win)) {
          this.opts.onFar?.(win)
        }
      }
    }, this.opts.watchdogIntervalMs)
  }

  restart(): void {
    this.start()
  }

  stop(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer)
      this.watchdogTimer = null
    }
  }

  dispose(): void {
    this.stop()
  }

  update(options: Partial<DistanceMonitorOptions>): void {
    this.opts = { ...this.opts, ...options }
    this.restart()
  }
}

export function createDistanceMonitor(options: DistanceMonitorOptions): DistanceMonitor {
  return new DistanceMonitor(options)
}

/** Standalone utility for proximity checks so callers don't need to reimplement */
export function isCursorNearWindow(win: BrowserWindow, threshold = 90): boolean {
  const cursor = screen.getCursorScreenPoint()
  const [wx, wy] = win.getPosition()
  const [ww, wh] = win.getSize()
  return (
    cursor.x >= wx - threshold &&
    cursor.x <= wx + ww + threshold &&
    cursor.y >= wy - threshold &&
    cursor.y <= wy + wh + threshold
  )
}

/**
 * Factory producing a reusable proximity checker bound to a specific window getter.
 * Example: const isCursorNearToolbar = makeProximityChecker(() => toolbarWindow)
 */
export function makeProximityChecker(
  getWindow: () => BrowserWindow | undefined | null,
  defaultThreshold = 90
) {
  return (threshold = defaultThreshold): boolean => {
    const win = getWindow()
    if (!win || win.isDestroyed()) return false
    return isCursorNearWindow(win, threshold)
  }
}
