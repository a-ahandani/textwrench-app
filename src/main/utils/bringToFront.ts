import { getMainWindow } from '../services/window/window'

export const bringToFront = (): void => {
  const win = getMainWindow()
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }
    win.show()
    win.focus()
    win.setAlwaysOnTop(true)
    win.setAlwaysOnTop(false)
  }
}
