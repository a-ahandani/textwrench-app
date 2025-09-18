import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { getSettingsWindow } from '../windows/settings'
import { IPC_EVENTS } from '@shared/ipc-events'

let lastUpdateCheck = 0
let listenersRegistered = false

export async function checkForUpdates(): Promise<void> {
  const now = Date.now()
  const FIVE_MINUTES = 5 * 60 * 1000

  if (now - lastUpdateCheck < FIVE_MINUTES) {
    return
  }

  lastUpdateCheck = now
  log.info('Checking for updates...')

  // Ensure listeners are registered only once to avoid duplication on periodic checks
  if (!listenersRegistered) {
    listenersRegistered = true

    autoUpdater.on('update-available', (version) => {
      log.info('Update available:', version)
      getSettingsWindow()?.webContents.send(IPC_EVENTS.UPDATE_AVAILABLE, version)
    })

    autoUpdater.on('download-progress', (progress) => {
      getSettingsWindow()?.webContents.send(IPC_EVENTS.UPDATE_PROGRESS, progress)
    })

    autoUpdater.on('update-downloaded', () => {
      log.info('Update downloaded')
      getSettingsWindow()?.webContents.send(IPC_EVENTS.UPDATE_DOWNLOADED)
    })

    autoUpdater.on('error', (error) => {
      log.error('Update Error:', error)
      console.error('Update Error:', error)
    })
  }

  autoUpdater.checkForUpdatesAndNotify()
}
