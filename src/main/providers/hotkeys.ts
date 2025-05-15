import { app } from 'electron'
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
      })

      this.hotkeyProcess.on('exit', (code, signal) => {
        log.warn(`Hotkey process exited with code ${code}, signal ${signal}`)
        this.hotkeyProcess = null

        // Schedule a restart
        this.restartTimeout = setTimeout(() => {
          this.ensureHotkeyServiceRunning()
        }, 1000)
      })
    }

    if (!this.hotkeyProcess) {
      startProcess()
    }
  }

  private connect(): void {
    const tryConnect = (): void => {
      if (!fs.existsSync(PIPE_PATH)) {
        log.log('Hotkey pipe not found, retrying...')
        setTimeout(tryConnect, 500)
        return
      }

      this.client = net.createConnection(PIPE_PATH, () => {
        log.log('Connected to Go hotkey service')
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
        log.log('Hotkey connection closed')
        this.client = null
        setTimeout(tryConnect, 1000)
        // Ensure hotkey process is running if pipe closes unexpectedly
        this.ensureHotkeyServiceRunning()
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
