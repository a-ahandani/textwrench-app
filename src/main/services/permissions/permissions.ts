import { systemPreferences } from 'electron'
import log from 'electron-log'

export const checkPermissions = async (): Promise<boolean> => {
  if (process.platform !== 'darwin') return true

  const permissions = {
    access: systemPreferences.isTrustedAccessibilityClient(false)
  }

  log.info('Checking macOS permissions...')
  Object.entries(permissions).forEach(([key, value]) => {
    log.info(`----> ${key}: ${value}`)
  })

  if (permissions.access) return true
  log.info('Requesting macOS permissions...')
  return systemPreferences.isTrustedAccessibilityClient(true)
}
