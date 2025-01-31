import { store } from '../../store'
import { twService } from '../axios/axios'

export const processTextWithAI = async (text: string): Promise<string> => {
  const selectedPrompt = await store.get('selectedPrompt')
  const userPrompt = {
    role: 'user',
    content: `${selectedPrompt?.value}: \n\n ${text}`
  }

  const response = await twService.post('/protected/process-text', {
    text: userPrompt.content
  })

  return response.data?.processedText || ''
}
