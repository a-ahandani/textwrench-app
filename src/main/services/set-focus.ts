import { getMainWindow } from '../providers/window'
import { exec } from 'child_process'

export const bringToFront = (): void => {
  const mainWindow = getMainWindow()
  if (!mainWindow) return

  if (mainWindow.isMinimized()) {
    mainWindow.restore()
  }
  mainWindow.show()
  mainWindow.focus()
  mainWindow.setAlwaysOnTop(true)
  mainWindow.setAlwaysOnTop(false)

  if (process.platform === 'win32') {
    const title = mainWindow.getTitle().replace(/'/g, "''") // escape single-quotes
    exec(
      `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
      (err) => {
        if (err) console.error('AppActivate failed:', err)
      }
    )
  }
}

export const bringToFrontWindows = (): void => {
  const win = getMainWindow()
  if (!win) return
}
