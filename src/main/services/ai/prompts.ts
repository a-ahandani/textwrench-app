import { updateStore } from '../../store/helpers'
import { USER_PROMPT_LABELS, USER_PROMPTS, USER_PROMPTS_KEYS } from './constants'

export function initializePromptOptions() {
  const options = Object.values(USER_PROMPTS_KEYS).map((promptKey) => {
    return {
      label: USER_PROMPT_LABELS[promptKey],
      value: USER_PROMPTS[promptKey],
      id: promptKey
    }
  })

  updateStore('prompts', options)
}
