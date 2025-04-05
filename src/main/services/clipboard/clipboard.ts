import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import robot from 'robotjs_addon'
import { getCommandKey } from '../../utils/platform'
import { store } from '../../../main/store'
import { updateStore } from '../../../main/store/helpers'

const MIN_DELAY = 10
const MAX_DELAY = 300
const TEST_INTERVAL = 1000 * 60 * 60 * 4 // 4 hours
const DEFAULT_DELAY = 15

export const getSelectedText = async (maxWaitTime = 1500): Promise<string> => {
  const maxAttempts = 100
  let attempt = 0
  let totalWaited = 0

  let baseDelay = (await store.get('delay')) || DEFAULT_DELAY
  const lastTested = (await store.get('lastDelayTest')) || 0
  const now = Date.now()

  if (now - lastTested > TEST_INTERVAL && baseDelay > MIN_DELAY + 5) {
    baseDelay -= 5
    await updateStore('lastDelayTest', now)
    log.info('Trying slightly faster delay:', baseDelay)
  }

  log.info('-----> Clipboard delay starting at:', baseDelay)

  while (totalWaited < maxWaitTime && attempt < maxAttempts) {
    attempt++

    robot.setKeyboardDelay(baseDelay)
    clipboard.clear()
    await robot.keyTap('c', getCommandKey())

    const selectedText = clipboard.readText()
    log.info(`Attempt ${attempt} - Selected text:`, selectedText, !selectedText)

    if (selectedText) {
      return selectedText
    }

    const hasAccess = await checkPermissions()
    if (hasAccess && baseDelay < MAX_DELAY) {
      baseDelay += 10
      await updateStore('delay', baseDelay)
    }

    const nextWait = Math.min(200, 30 + 20 * attempt)
    totalWaited += nextWait
    await new Promise((res) => setTimeout(res, nextWait))
  }

  log.warn(`Could not get selected text after ${attempt} attempts and ${totalWaited}ms`)
  return ''
}

export const pasteContent = async (): Promise<void> => {
  await robot.keyTap('v', getCommandKey())
}

export const hidePaste = async (text): Promise<void> => {
  robot.setKeyboardDelay(70)
  clipboard.writeText(text)
  robot.keyTap('tab', getCommandKey())
  robot.keyTap('enter')
  pasteContent()
}
