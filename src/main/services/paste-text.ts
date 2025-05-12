import { hotkeyClient } from '../providers/hotkeys'

export const paste = (text): void => {
  const key = `PASTE|${text}`
  hotkeyClient.send(key)
}

export const focusPaste = async (text: string): Promise<void> => {
  const key = `FOCUS_PASTE|${text}`
  hotkeyClient.send(key)
}
