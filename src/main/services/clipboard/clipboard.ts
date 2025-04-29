import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import robot from 'robotjs_addon'
import { getCommandKey } from '../../utils/platform'

const RETRY_DELAYS = [50, 100, 200]

export const getSelectedText = async (): Promise<string> => {
  for (let i = 0; i < RETRY_DELAYS.length; i++) {
    const delay = RETRY_DELAYS[i]

    robot.setKeyboardDelay(delay)
    clipboard.clear()
    await robot.keyTap('c', getCommandKey())
    await new Promise((res) => setTimeout(res, 100))

    const text = clipboard.readText()
    log.info(`Attempt ${i + 1} with delay ${delay}ms: "${text.slice(0, 20)}..."`)

    if (text) {
      log.info(`Successfully retrieved selected text on attempt ${i + 1}`)
      return text
    }

    const hasAccess = await checkPermissions()
    if (!hasAccess) {
      log.warn('Missing clipboard permissions, aborting.')
      break
    }

    await new Promise((res) => setTimeout(res, delay))
  }

  log.warn('Failed to retrieve selected text after 3 attempts.')
  return ''
}

export const pasteContent = async (): Promise<void> => {
  robot.setKeyboardDelay(120)
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
