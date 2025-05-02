import log from 'electron-log'

import { spawn } from 'child_process'
import { getBinaryPath } from 'textwrench-hotkeys'
import { app } from 'electron'

let hotkeyProc: ReturnType<typeof spawn> | null = null

export function startHotkeyHandler(): void {
  const binaryPath = getBinaryPath()

  hotkeyProc = spawn(binaryPath, [], {
    stdio: 'pipe',
    windowsHide: true
  })

  hotkeyProc.stdout?.on('data', (data) => {
    log.info(`[hotkey stdout]: ${data.toString().trim()}`)
  })

  hotkeyProc.stderr?.on('data', (data) => {
    log.error(`[hotkey stderr]: ${data.toString().trim()}`)
  })

  hotkeyProc.on('close', (code) => {
    log.warn(`hotkey process exited with code ${code}`)
  })

  hotkeyProc.on('error', (err) => {
    log.error(`Failed to start hotkey process:`, err)
  })
}

app.on('before-quit', () => {
  if (hotkeyProc) {
    hotkeyProc.kill()
    hotkeyProc = null
  }
})
