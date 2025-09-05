import { getSettingsWindow } from '../windows/settings'
import { exec } from 'child_process'

export const bringToFront = (): void => {
  const settingsWindow = getSettingsWindow()
  if (!settingsWindow) return

  if (settingsWindow.isMinimized()) {
    settingsWindow.restore()
  }
  settingsWindow.show()
  settingsWindow.focus()
  settingsWindow.setAlwaysOnTop(true)
  settingsWindow.setAlwaysOnTop(false)

  if (process.platform === 'win32') {
    const title = settingsWindow.getTitle().replace(/'/g, "''") // escape single-quotes
    exec(
      `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
      (err) => {
        if (err) console.error('AppActivate failed:', err)
      }
    )
  }
}

export const bringToFrontWindows = (): void => {
  const settingsWindow = getSettingsWindow()
  if (!settingsWindow) return
}
