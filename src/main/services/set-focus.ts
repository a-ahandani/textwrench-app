import { getMainWindow } from '../providers/window'

export const bringToFront = (): void => {
  const mainWindow = getMainWindow()
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(true)
    mainWindow.setAlwaysOnTop(false)
  }
}

// export const bringToFront = (): void => {
//   const win = getMainWindow()
//   if (!win) return

//   if (win.isMinimized()) {
//     win.restore()
//   }

//   // Make it visible (this also un-minimizes)
//   win.show()

//   // Force it above all windows...
//   win.setAlwaysOnTop(true, 'screen')
//   // ...then focus it
//   win.focus()

//   // After a short delay, drop the always-on-top so it behaves normally again
//   setTimeout(() => {
//     win.setAlwaysOnTop(false)
//   }, 50)
// }

// import { exec } from 'child_process'

// export const bringToFront = (): void => {
//   const win = getMainWindow()
//   if (!win) return

//   if (win.isMinimized()) {
//     win.restore()
//   }
//   win.show()

//   // Use WScript.Shell.AppActivate to force focus by window title
//   const title = win.getTitle().replace(/'/g, "''") // escape single-quotes
//   exec(
//     `powershell -Command "(New-Object -ComObject WScript.Shell).AppActivate('${title}')"`,
//     (err) => {
//       if (err) console.error('AppActivate failed:', err)
//     }
//   )
// }

// import ffi from 'ffi-napi'
// import ref from 'ref-napi'
// import { BrowserWindow } from 'electron'

// // define the calls we need
// const user32 = new ffi.Library('user32', {
//   FindWindowA: ['int32', ['string', 'string']],
//   SetForegroundWindow: ['bool', ['int32']]
// })

// export const bringToFront = (): void => {
//   const win: BrowserWindow | null = getMainWindow()
//   if (!win) return

//   if (win.isMinimized()) win.restore()
//   win.show()

//   // grab the HWND by window title (class name=null, title=our title)
//   const hwnd = user32.FindWindowA(null, win.getTitle())
//   if (!hwnd) {
//     console.error('Couldn’t find window handle for', win.getTitle())
//     return
//   }

//   // this is essentially SetForegroundWindow(hwnd)
//   if (!user32.SetForegroundWindow(hwnd)) {
//     console.warn('SetForegroundWindow failed')
//   }
// }
