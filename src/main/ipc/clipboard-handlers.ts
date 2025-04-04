import { clipboard } from 'electron'
import { AiMode, processTextWithAI } from '../services/ai/openai'
import { getSelectedText, pasteContent } from '../services/clipboard/clipboard'
import { updateStore } from '../store/helpers'
import { bringToFront } from '../utils/bringToFront'
import { store } from '../store'
import { IPC_EVENTS } from '@shared/ipc-events'
import { getMainWindow } from '../services/window/window'

export const handleReviseText = async (): Promise<void> => {
  const selectedPrompt = await store.get('selectedPrompt')
  const currentClipboardContent = clipboard.readText()

  const selectedText = await getSelectedText()
  if (!selectedText) return
  updateStore('selectedText', selectedText)

  const processedText = await processTextWithAI({ selectedText, selectedPrompt })
  clipboard.writeText(processedText)
  await pasteContent()

  clipboard.writeText(currentClipboardContent)
}

export const handleSelectPrompt = async (): Promise<void> => {
  const mainWindow = getMainWindow()
  let selectedText = await store.get('selectedText')
  if (!mainWindow?.isFocused()) {
    selectedText = await getSelectedText()
    bringToFront()
  }
  mainWindow?.webContents.send(IPC_EVENTS.OPEN_MODAL, { data: selectedText, type: 'prompt' })
  mainWindow?.setSize(720, 420)
}

export const handleExplainText = async (): Promise<void> => {
  const mainWindow = getMainWindow()

  const selectedText = await getSelectedText()
  if (!selectedText) return

  const processedText = await processTextWithAI({
    selectedText,
    selectedPrompt: {
      value:
        'Summarize the following text concisely while preserving its key context and meaning.Keep it short, clear, and impactful.Use separate lines for better readability.'
    },
    mode: AiMode.Explain
  })
  bringToFront()
  mainWindow?.webContents.send(IPC_EVENTS.OPEN_MODAL, { data: processedText, type: 'explain' })
  mainWindow?.setSize(720, 420)
}
