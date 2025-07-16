import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { getSettingsWindow } from '../windows/settings'
import { IPC_EVENTS } from '@shared/ipc-events'

let lastUpdateCheck = 0

export async function checkForUpdates(): Promise<void> {
  const now = Date.now()
  const FIVE_MINUTES = 5 * 60 * 1000

  if (now - lastUpdateCheck < FIVE_MINUTES) {
    return
  }

  lastUpdateCheck = now
  log.info('Checking for updates...')

  const settingsWindow = getSettingsWindow()
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('update-available', (version) => {
    log.info('Update available:', version)
    settingsWindow?.webContents.send(IPC_EVENTS.UPDATE_AVAILABLE, version)
  })

  autoUpdater.on('download-progress', (progress) => {
    settingsWindow?.webContents.send(IPC_EVENTS.UPDATE_PROGRESS, progress)
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded')
    settingsWindow?.webContents.send(IPC_EVENTS.UPDATE_DOWNLOADED)
  })

  autoUpdater.on('error', (error) => {
    log.error('Update Error:', error)
    console.error('Update Error:', error)
  })
}
