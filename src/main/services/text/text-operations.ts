import { writeToClipboard, pasteContent } from '../clipboard/clipboard'
import { processTextWithAI } from '../ai/openai'

export const updateSelectedText = async (text): Promise<void> => {
  if (!text) return
  const processedText = await processTextWithAI(text)
  writeToClipboard(processedText)
  pasteContent()
}
