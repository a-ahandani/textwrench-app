import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import { Key, keyboard } from '@nut-tree-fork/nut-js'
import { getCommandKey } from '../../utils/platform'

keyboard.config.autoDelayMs = 50
export const getSelectedText = async (): Promise<string> => {
  clipboard.clear()

  await keyboard.pressKey(getCommandKey(), Key.C)
  await keyboard.releaseKey(getCommandKey(), Key.C)

  const selectedText = clipboard.readText()
  log.info('Selected text:', selectedText, !selectedText)
  if (!selectedText) {
    checkPermissions()
  }

  return selectedText
}

export const pasteContent = async (): Promise<void> => {
  await keyboard.pressKey(getCommandKey(), Key.V)
  await keyboard.releaseKey(getCommandKey(), Key.V)
}
