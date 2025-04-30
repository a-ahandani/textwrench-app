import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import robot from 'robotjs_addon'
import { getCommandKey } from '../../utils/platform'

let RETRY_DELAYS = [300, 480, 890, 1000] // in ms

if (process.platform === 'darwin') {
  RETRY_DELAYS = [50, 70, 100, 180, 220, 500]
}
const ATTEMPT_TIMEOUT = 1000 // max time to wait per attempt in ms

let currentTask: Promise<string> | null = null

export const getSelectedText = async (): Promise<string> => {
  if (currentTask) return currentTask

  currentTask = (async () => {
    for (let i = 0; i < RETRY_DELAYS.length; i++) {
      const delay = RETRY_DELAYS[i]
      robot.setKeyboardDelay(delay)
      clipboard.clear()

      await robot.keyTap('c', getCommandKey())
      await sleep(100)

      const text = await waitForClipboardText(ATTEMPT_TIMEOUT)
      log.info(`Attempt ${i + 1} with delay ${delay}ms: "${text.slice(0, 20)}..."`)

      if (text) {
        log.info(`✅ Successfully retrieved selected text on attempt ${i + 1}`)
        currentTask = null
        return text
      }

      const hasAccess = await checkPermissions()
      if (!hasAccess) {
        log.warn('❌ Missing clipboard permissions, aborting.')
        break
      }

      await sleep(delay)
    }

    log.warn('❌ Failed to retrieve selected text after all attempts.')
    currentTask = null
    return ''
  })()

  return currentTask
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const waitForClipboardText = async (timeout: number): Promise<string> => {
  const interval = 50
  let waited = 0

  while (waited < timeout) {
    const text = clipboard.readText()
    if (text) return text

    await sleep(interval)
    waited += interval
  }

  return ''
}

export const pasteContent = async (): Promise<void> => {
  if (process.platform === 'darwin') {
    robot.setKeyboardDelay(80)
  } else {
    robot.setKeyboardDelay(220)
  }

  await robot.keyTap('v', getCommandKey())
}

export const hidePaste = async (text): Promise<void> => {
  robot.setKeyboardDelay(120)
  clipboard.writeText(text)
  if (process.platform === 'darwin') {
    robot.keyTap('tab', getCommandKey())
  } else {
    robot.keyTap('tab', 'alt')
  }
  robot.keyTap('enter')
  pasteContent()
}
