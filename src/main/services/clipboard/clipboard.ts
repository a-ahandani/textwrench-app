import { clipboard } from 'electron'
import log from 'electron-log'
import { checkPermissions } from '../permissions/permissions'
import robot from 'robotjs_addon'
import { getCommandKey } from '../../utils/platform'
import { store } from '../../../main/store'
import { updateStore } from '../../../main/store/helpers'

const MIN_DELAY = 10
const MAX_DELAY = 300
const REDUCE_DELAY_THRESHOLD = 150
const DEFAULT_DELAY = 50

export const getSelectedText = async (maxWaitTime = 1500): Promise<string> => {
  const maxAttempts = 10 // Limit the number of attempts to avoid excessive retries
  let attempt = 0
  let totalWaited = 0
  let baseDelay = (await store.get('delay')) ?? DEFAULT_DELAY

  // Adjust the delay if it's too high initially
  if (baseDelay > REDUCE_DELAY_THRESHOLD && baseDelay > MIN_DELAY + 5) {
    baseDelay -= 5
    await updateStore('delay', baseDelay)
    log.info(`Initial delay too high, reducing to ${baseDelay}`)
  }

  log.info('Starting with clipboard delay:', baseDelay)

  while (totalWaited < maxWaitTime && attempt < maxAttempts) {
    attempt++

    robot.setKeyboardDelay(baseDelay)
    clipboard.clear()
    await robot.keyTap('c', getCommandKey())

    let selectedText = clipboard.readText()
    log.debug(`Attempt ${attempt} - Selected text: "${selectedText.slice(0, 20)}..."`)

    // Quick retry on first failure to handle any possible lag or sync issue
    if (attempt === 1 && !selectedText) {
      await new Promise((res) => setTimeout(res, 20)) // Quick retry with minimal delay
      selectedText = clipboard.readText()
      log.debug(`Quick retry - Selected text: "${selectedText.slice(0, 20)}..."`)
    }

    if (selectedText) {
      log.info(`Successfully retrieved selected text after ${attempt} attempts`)
      return selectedText
    }

    const hasAccess = await checkPermissions()
    if (!hasAccess) {
      log.warn('Missing clipboard permissions, aborting.')
      break
    }

    // Gradually increase delay after each failure, but ensure it does not exceed the maximum
    if (baseDelay < MAX_DELAY) {
      baseDelay = Math.min(baseDelay + 10, MAX_DELAY)
      await updateStore('delay', baseDelay)
      log.info(`Increasing delay to ${baseDelay} due to failure`)
    }

    // Exponentially increase wait time for each attempt to reduce unnecessary retries
    const waitTime = Math.min(200, 30 + attempt * 20)
    totalWaited += waitTime
    await new Promise((res) => setTimeout(res, waitTime))
  }

  log.warn(`Failed to retrieve selected text after ${attempt} attempts and ${totalWaited}ms`)
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
