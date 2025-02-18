import { clipboard } from 'electron'
import { keyTap } from '@hurdlegroup/robotjs'
import { getCommandKey } from '../../utils/platform'
import { wait } from '../../utils/wait'

export const getSelectedText = async (): Promise<string> => {
  if (process.platform === 'darwin') {
    await wait()
  }
  const currentClipboardContent = clipboard.readText()
  clipboard.clear()

  keyTap('c', getCommandKey())
  if (process.platform === 'darwin') {
    await wait()
  }
  const selectedText = clipboard.readText()
  clipboard.writeText(currentClipboardContent)
  return selectedText
}

export const writeToClipboard = (text: string): void => {
  clipboard.writeText(text)
}

export const pasteContent = (): void => {
  keyTap('v', getCommandKey())
}
