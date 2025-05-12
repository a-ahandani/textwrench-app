import { app } from 'electron'
import { EventEmitter } from 'events'
import net from 'net'
import os from 'os'
import path from 'path'
import fs from 'fs'
import log from 'electron-log'

const PIPE_PATH =
  process.platform === 'win32'
    ? '\\\\.\\pipe\\textwrench-pipe'
    : path.join(os.tmpdir(), 'textwrench.sock')

class HotkeyClient extends EventEmitter {
  private client: net.Socket | null = null

  constructor() {
    super()
    this.connect()
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
      })

      app.on('before-quit', () => {
        this.client?.end()
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
