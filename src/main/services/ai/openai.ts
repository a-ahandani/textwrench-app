import OpenAI from 'openai'
import { Roles, USER_PROMPTS } from './constants'
import { store } from '../../store'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

export const openAiClient = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey
})

export const processTextWithAI = async (text: string): Promise<string> => {
  const selectedPrompt = await store.get('selectedPrompt')

  const userPrompt = {
    role: Roles.User,
    content: `${USER_PROMPTS[selectedPrompt]}: \n\n ${text}`
  }

  const response = await axios.post('http://textwrench.ai/api/process-text', {
    text: userPrompt.content
  })

  return response.data?.processedText || ''
}
