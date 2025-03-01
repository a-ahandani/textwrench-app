import { IPC_EVENTS } from '../../../shared/ipc-events'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { getMainWindow } from '../window/window'

export async function checkForUpdates(): Promise<void> {
  log.info('Checking for updates...')
  const mainWindow = getMainWindow()

  autoUpdater.checkForUpdatesAndNotify()
  autoUpdater.on('update-available', (version) => {
    log.info('Update available:', version)
    mainWindow?.webContents.send(IPC_EVENTS.UPDATE_AVAILABLE, version)
  })

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded')
    mainWindow?.webContents.send(IPC_EVENTS.UPDATE_DOWNLOADED)
  })

  autoUpdater.on('error', (error) => {
    log.error('Update Error:', error)
    console.error('Update Error:', error)
  })
}
