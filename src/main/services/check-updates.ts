import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { IPC_EVENTS } from '@shared/ipc-events'
import { app, BrowserWindow } from 'electron'

let lastUpdateCheck = 0
let listenersRegistered = false

type ReleaseNoteLike =
  | string
  | Array<{ note?: string | null; version?: string }>
  | null
  | undefined

function normalizeReleaseNotes(releaseNotes: ReleaseNoteLike): string {
  if (!releaseNotes) return ''
  if (typeof releaseNotes === 'string') return releaseNotes
  if (Array.isArray(releaseNotes)) {
    return releaseNotes
      .map((entry) => entry?.note || '')
      .filter(Boolean)
      .join('\n\n')
  }
  return ''
}

function broadcast(channel: string, payload?: unknown): void {
  for (const win of BrowserWindow.getAllWindows()) {
    if (win.isDestroyed()) continue
    try {
      win.webContents.send(channel, payload)
    } catch {
      // ignore send failures for windows that are mid-destroy
    }
  }
}

export async function checkForUpdates(
  options: { force?: boolean; source?: 'startup' | 'periodic' | 'focus' | 'manual' } = {}
): Promise<void> {
  if (!app.isPackaged && !autoUpdater.forceDevUpdateConfig) return

  const now = Date.now()
  const FIVE_MINUTES = 5 * 60 * 1000

  if (!options.force && now - lastUpdateCheck < FIVE_MINUTES) {
    return
  }

  lastUpdateCheck = now
  log.info('Checking for updates...', options.source ? `source=${options.source}` : '')

  broadcast(IPC_EVENTS.UPDATE_CHECKING)

  // Ensure listeners are registered only once to avoid duplication on periodic checks
  if (!listenersRegistered) {
    listenersRegistered = true

    autoUpdater.logger = log
    autoUpdater.autoDownload = true

    autoUpdater.on('checking-for-update', () => {
      broadcast(IPC_EVENTS.UPDATE_CHECKING)
    })

    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info?.version)
      broadcast(IPC_EVENTS.UPDATE_AVAILABLE, {
        version: info?.version || '',
        releaseNotes: normalizeReleaseNotes(info?.releaseNotes)
      })
    })

    autoUpdater.on('download-progress', (progress) => {
      broadcast(IPC_EVENTS.UPDATE_PROGRESS, progress)
    })

    autoUpdater.on('update-not-available', () => {
      broadcast(IPC_EVENTS.UPDATE_NOT_AVAILABLE)
    })

    autoUpdater.on('update-downloaded', (event) => {
      log.info('Update downloaded:', event?.version)
      broadcast(IPC_EVENTS.UPDATE_DOWNLOADED, { version: event?.version })
    })

    autoUpdater.on('error', (error) => {
      log.error('Update Error:', error)
      broadcast(IPC_EVENTS.UPDATE_ERROR, { message: String(error) })
    })
  }

  try {
    await autoUpdater.checkForUpdates()
  } catch (error) {
    log.error('checkForUpdates failed:', error)
    broadcast(IPC_EVENTS.UPDATE_ERROR, { message: String(error) })
  }
}
