import { clipboard } from 'electron'
import { processTextWithAI } from '../services/ai/openai'
import { getSelectedText, pasteContent } from '../services/clipboard/clipboard'
import { updateStore } from '../store/helpers'

export const handleSelectedText = async (): Promise<void> => {
  const currentClipboardContent = clipboard.readText()

  const selectedText = await getSelectedText()
  if (!selectedText) return
  updateStore('selectedText', selectedText)

  const processedText = await processTextWithAI(selectedText)
  clipboard.writeText(processedText)
  await pasteContent()

  clipboard.writeText(currentClipboardContent)
}
