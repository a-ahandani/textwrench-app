import { ipcMain } from 'electron'
import { USER_PROMPT_LABELS, USER_PROMPTS_KEYS } from '../ai/constants'
import { IPC_CHANNELS } from './constants'

export function setupIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.GET_PROMPT_OPTIONS, () => {
    const options = Object.values(USER_PROMPTS_KEYS).map((promptKey) => {
      return {
        label: USER_PROMPT_LABELS[promptKey],
        value: promptKey
      }
    })
    console.log('options===>', options)
    return options
  })
}
