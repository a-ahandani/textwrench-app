import { writeToClipboard, pasteContent } from '../clipboard/clipboard'
import { processTextWithAI } from '../ai/openai'

export const updateSelectedText = async (text): Promise<void> => {
  const processedText = await processTextWithAI(text)
  writeToClipboard(processedText)
  pasteContent()
}
