import { clipboard } from 'electron'
import { keyTap } from '@hurdlegroup/robotjs'
import { getCommandKey } from '../../utils/platform'
import { wait } from '../../utils/wait'

export const getSelectedText = async (): Promise<string> => {
  await wait()
  const currentClipboardContent = clipboard.readText()
  clipboard.clear()
  await wait()

  keyTap('c', getCommandKey())

  await wait()

  const selectedText = clipboard.readText()
  console.log('Selected text:', selectedText)
  clipboard.writeText(currentClipboardContent)
  await wait()
  return selectedText
}

export const pasteContent = async (): Promise<void> => {
  await wait()
  keyTap('v', getCommandKey())
}
