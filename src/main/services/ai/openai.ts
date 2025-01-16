import { Roles, USER_PROMPTS } from './constants'
import { store } from '../../store'
import { twService } from '../axios/axios'

export const processTextWithAI = async (text: string): Promise<string> => {
  const selectedPrompt = await store.get('selectedPrompt')

  const userPrompt = {
    role: Roles.User,
    content: `${USER_PROMPTS[selectedPrompt]}: \n\n ${text}`
  }

  const response = await twService.post('/protected/process-text', {
    text: userPrompt.content
  })

  return response.data?.processedText || ''
}
