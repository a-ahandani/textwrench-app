import { app, dialog } from 'electron'
import { EventEmitter } from 'events'
import net from 'net'
import os from 'os'
import path from 'path'
import fs from 'fs'
import log from 'electron-log'
import { getBinaryPath } from 'textwrench-hotkeys'
import { spawn, ChildProcess } from 'child_process'

const PIPE_PATH =
  process.platform === 'win32'
    ? '\\\\.\\pipe\\textwrench-pipe'
    : path.join(os.tmpdir(), 'textwrench.sock')

class HotkeyClient extends EventEmitter {
  private client: net.Socket | null = null
  private hotkeyProcess: ChildProcess | null = null
  private restartTimeout: NodeJS.Timeout | null = null

  constructor() {
    super()
    this.ensureHotkeyServiceRunning()
    this.connect()
  }

  private retryCount = 0
  private maxRetries = 20

  private scheduleRestart(): void {
    if (this.retryCount >= this.maxRetries) {
      log.error('Max retries reached. Giving up on hotkey service connection.')
      return
    }
    const delay = Math.min(1000 * 2 ** this.retryCount, 30000)

    log.warn(
      `Retrying hotkey service in ${delay}ms (attempt ${this.retryCount + 1}/${this.maxRetries})`
    )
    this.restartTimeout = setTimeout(() => {
      this.ensureHotkeyServiceRunning()
    }, delay)
    this.retryCount++
  }

  private ensureHotkeyServiceRunning(): void {
    const startProcess = (): void => {
      const binaryPath = getBinaryPath()
      if (!fs.existsSync(binaryPath)) {
        log.error('Hotkey binary not found at', binaryPath)
        return
      }

      log.log('Starting hotkey binary at:', binaryPath)
      this.hotkeyProcess = spawn(binaryPath, [], {
        stdio: 'ignore',
        detached: false
      })

      this.hotkeyProcess.on('error', (err) => {
        log.error('Failed to start hotkey service:', err)
        this.scheduleRestart()
      })

      this.hotkeyProcess.on('exit', (code, signal) => {
        log.warn(`Hotkey process exited with code ${code}, signal ${signal}`)
        this.hotkeyProcess = null
        this.scheduleRestart()
      })
    }

    if (!this.hotkeyProcess) {
      startProcess()
    }
  }

  private connect(): void {
    const tryConnect = (): void => {
      this.client = net.createConnection(PIPE_PATH, () => {
        log.log('Connected to hotkey service')
        this.retryCount = 0
      })

      this.client.on('data', (data) => {
        const raw = data.toString().trim()
        const [hotkey, ...textParts] = raw.split('|')
        const text = textParts.join('|')
        if (hotkey && text) {
          this.emit('hotkey', { hotkey, text })
        } else {
          log.warn('Malformed message from hotkey service:', raw)
        }
      })

      this.client.on('error', (err) => {
        log.error('Hotkey pipe connection error:', err)
        this.client?.destroy()
      })

      this.client.on('close', () => {
        log.log('Hotkey connection closed', this.retryCount)
        this.retryCount++
        this.client = null
        if (this.retryCount < this.maxRetries) {
          setTimeout(tryConnect, 5000)
        } else {
          log.error('Max connection retries reached. Hotkey service unavailable.')
          // alert the user or handle gracefully
          this.retryCount = 0
          // on confirm kill the application
          dialog.showErrorBox(
            'Hotkey Service Unavailable',
            'The hotkey service is currently unavailable. Please ensure it is running or restart the application.'
          )
          app.quit()
        }
      })

      app.on('before-quit', () => {
        this.client?.end()
        this.hotkeyProcess?.kill()
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout)
        }
      })
    }

    tryConnect()
  }

  public send(message: string): void {
    if (this.client?.writable) {
      this.client.write(message + '\n')
    } else {
      log.warn('Cannot send, hotkey client not connected')
    }
  }
}

export const hotkeyClient = new HotkeyClient()
