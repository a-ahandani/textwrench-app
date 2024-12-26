import { getMainWindow } from '../window/window'
import { getSelectedText } from '../clipboard/clipboard'
import { updateSelectedText } from '../text/text-operations'
import { IPC_EVENTS } from '../../constants/ipc'

export const handleSelectedText = async (): Promise<void> => {
  const selectedText = await getSelectedText()
  const mainWindow = getMainWindow()

  if (mainWindow) {
    mainWindow.webContents.send(IPC_EVENTS.CLIPBOARD_UPDATED, selectedText)
  }

  await updateSelectedText(selectedText)
}
