import { getSettingsWindow, showSettingsWindowExplicitly } from '../windows/settings'
import { exec } from 'child_process'

export const bringToFront = (
  window: Electron.CrossProcessExports.BrowserWindow | null = null
): void => {
  const targetWindow = window || getSettingsWindow()
  if (!targetWindow) {
    showSettingsWindowExplicitly()
    return
  }

  if (targetWindow.isMinimized()) {
    targetWindow.restore()
  }
  targetWindow.show()
  targetWindow.focus()
  targetWindow.setAlwaysOnTop(true)
  targetWindow.setAlwaysOnTop(false)

  if (process.platform === 'win32') {
    const title = targetWindow.getTitle().replace(/'/g, "''") // escape single-quotes
    exec(
      `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
      (err) => {
        if (err) console.error('AppActivate failed:', err)
      }
    )
  }
}

export const bringToFrontWindows = (): void => {
  const targetWindow = getSettingsWindow()
  if (!targetWindow) return
}
