import { clipboard } from 'electron'
import { processTextWithAI } from '../services/ai/openai'
import { getSelectedText, pasteContent } from '../services/clipboard/clipboard'
import { updateStore } from '../store/helpers'

export const handleSelectedText = async (): Promise<void> => {
  const selectedText = await getSelectedText()
  updateStore('selectedText', selectedText)

  const processedText = await processTextWithAI(selectedText)
  clipboard.writeText(processedText)
  await pasteContent()
}
