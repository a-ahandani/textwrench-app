import { store } from '../providers/store'
import { hotkeyClient } from '../providers/hotkeys'
import { updateStore } from '../services/update-store'
import { AiMode, processText } from '../services/process-text'
import { ACTIONS } from '@shared/constants'
import { getMainWindow } from '../providers/window'
import { bringToFront } from '../services/set-focus'
import { IPC_EVENTS } from '@shared/ipc-events'
import { paste } from '../services/paste-text'
import { log } from 'electron-log'

const handleReviseText = async ({ selectedText }) => {
  log('Selected text:--------->', selectedText)
  const selectedPrompt = await store.get('selectedPrompt')
  const processedText = await processText({ selectedText, selectedPrompt })
  paste(processedText)
}

const handleExplainText = async ({ selectedText }) => {
  const mainWindow = getMainWindow()

  if (!selectedText) return

  const processedText = await processText({
    selectedText,
    selectedPrompt: {
      value:
        'Summarize the following text concisely while preserving its key context and meaning.Keep it short, clear, and impactful.Use separate lines for better readability.'
    },
    mode: AiMode.Explain
  })
  bringToFront()
  mainWindow?.webContents.send(IPC_EVENTS.OPEN_MODAL, { data: processedText, type: 'explain' })
}

const handleSelectPrompt = async ({ selectedText }) => {
  const mainWindow = getMainWindow()
  if (!mainWindow?.isFocused()) {
    bringToFront()
  }
  mainWindow?.webContents.send(IPC_EVENTS.OPEN_MODAL, { data: selectedText, type: 'prompt' })
}

const handlers = {
  [ACTIONS.CORRECT_TEXT]: handleReviseText,
  [ACTIONS.EXPLAIN_TEXT]: handleExplainText,
  [ACTIONS.SELECT_PROMPT]: handleSelectPrompt
}

export const hotkeyHandler = () => {
  hotkeyClient.on('hotkey', async ({ hotkey, text }) => {
    log('==> Received hotkey:', hotkey, 'with text:', text)
    if (!text) return
    updateStore('selectedText', text)

    handlers[hotkey]({
      selectedText: text
    })
  })
}
