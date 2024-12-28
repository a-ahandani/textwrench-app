import { store } from '../../store'
import { USER_PROMPT_LABELS, USER_PROMPTS_KEYS } from './constants'

export function initializePromptOptions() {
  const options = Object.values(USER_PROMPTS_KEYS).map((promptKey) => {
    return {
      label: USER_PROMPT_LABELS[promptKey],
      value: promptKey
    }
  })

  store.set('prompts', options)
}
