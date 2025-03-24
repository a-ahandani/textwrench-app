import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import robot from 'robotjs_addon'
import { getCommandKey } from '../../utils/platform'

export const getSelectedText = async (): Promise<string> => {
  robot.setKeyboardDelay(50)
  clipboard.clear()

  await robot.keyTap('c', getCommandKey())

  const selectedText = clipboard.readText()
  log.info('Selected text:', selectedText, !selectedText)
  if (!selectedText) {
    checkPermissions()
  }

  return selectedText
}

export const pasteContent = async (): Promise<void> => {
  await robot.keyTap('v', getCommandKey())
}
