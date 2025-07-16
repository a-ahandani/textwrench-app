import { twService } from '../providers/axios'
import { store } from '../providers/store'

export enum AiMode {
  Improve = 'improve',
  Explain = 'explain'
}

export const processText = async ({
  selectedPrompt,
  selectedText,
  mode = AiMode.Improve
}: {
  selectedPrompt: { value: string }
  selectedText: string
  mode?: AiMode
}): Promise<string> => {
  const storedPrompt = await store.get('selectedPrompt')
  const prompt = selectedPrompt?.value || storedPrompt?.value || ''
  const userPrompt = {
    role: 'user',
    content: `${prompt}: \n\n ${selectedText}`
  }

  const response = await twService.post('/protected/process-text', {
    text: userPrompt.content,
    mode
  })

  return response.data?.processedText || ''
}
