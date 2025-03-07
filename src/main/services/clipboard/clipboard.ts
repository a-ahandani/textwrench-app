import { clipboard } from 'electron'
import { keyTap } from '@hurdlegroup/robotjs'
import { getCommandKey } from '../../utils/platform'
import { wait } from '../../utils/wait'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'

export const getSelectedText = async (): Promise<string> => {
  await wait()
  const currentClipboardContent = clipboard.readText()
  clipboard.clear()
  await wait()

  keyTap('c', getCommandKey())

  await wait()

  const selectedText = clipboard.readText()
  log.info('Selected text:', selectedText, !selectedText)
  if (!selectedText) {
    checkPermissions()
  }

  clipboard.writeText(currentClipboardContent)
  await wait()
  return selectedText
}

export const pasteContent = async (): Promise<void> => {
  await wait()
  keyTap('v', getCommandKey())
}
