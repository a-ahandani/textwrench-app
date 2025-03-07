import { systemPreferences } from 'electron'
import log from 'electron-log'

export const checkPermissions = async () => {
  if (process.platform !== 'darwin') return

  const permissions = {
    access: systemPreferences.isTrustedAccessibilityClient(false)
  }

  log.info('Checking macOS permissions...');
  Object.entries(permissions).forEach(([key, value]) => {
    log.info(`----> ${key}: ${value}`)
  })

  if (!permissions.access) {
    log.info('Requesting macOS permissions...')
    systemPreferences.isTrustedAccessibilityClient(true)
  }
}
