import { getMainWindow } from '../services/window/window'
import { getSelectedText } from '../services/clipboard/clipboard'
import { updateSelectedText } from '../services/text/text-operations'

export const handleSelectedText = async (): Promise<void> => {
  const selectedText = await getSelectedText()
  const mainWindow = getMainWindow()

  if (mainWindow) {
    // clipboard updated event
  }

  await updateSelectedText(selectedText)
}
