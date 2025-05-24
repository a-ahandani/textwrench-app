import { getMainWindow } from '../providers/window'

import { exec } from 'child_process'

export const bringToFront = (): void => {
  const win = getMainWindow()
  if (!win) return

  if (win.isMinimized()) {
    win.restore()
  }
  win.show()

  // Use WScript.Shell.AppActivate to force focus by window title
  const title = win.getTitle().replace(/'/g, "''") // escape single-quotes
  exec(
    `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
    (err) => {
      if (err) console.error('AppActivate failed:', err)
    }
  )
}
