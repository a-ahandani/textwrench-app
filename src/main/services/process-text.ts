import { twService } from '../providers/axios'
import { store } from '../providers/store'
import { AiMode } from '@shared/ai'

export const processText = async ({
  selectedPrompt,
  selectedText,
  mode = AiMode.Improve
}: {
  // Made optional to allow calls without a prompt (e.g., explain panel)
  selectedPrompt?: { value: string }
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
