import { Roles, USER_PROMPTS } from './constants'
import { store } from '../../store'
import axios from 'axios'

const apiServer = import.meta.env.VITE_API_SERVER

export const processTextWithAI = async (text: string): Promise<string> => {
  const selectedPrompt = await store.get('selectedPrompt')

  const userPrompt = {
    role: Roles.User,
    content: `${USER_PROMPTS[selectedPrompt]}: \n\n ${text}`
  }

  const response = await axios.post(`${apiServer}/process-text`, {
    text: userPrompt.content
  })

  return response.data?.processedText || ''
}
