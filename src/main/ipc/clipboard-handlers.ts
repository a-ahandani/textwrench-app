import { getMainWindow } from '../services/window/window'
import { getSelectedText } from '../services/clipboard/clipboard'
import { updateSelectedText } from '../services/text/text-operations'
import { IPC_EVENTS } from './constants'

export const handleSelectedText = async (): Promise<void> => {
  const selectedText = await getSelectedText()
  const mainWindow = getMainWindow()

  if (mainWindow) {
    mainWindow.webContents.send(IPC_EVENTS.CLIPBOARD_UPDATED, selectedText)
  }

  await updateSelectedText(selectedText)
}
