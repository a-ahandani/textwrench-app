import { twService } from '../providers/axios'

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
  const userPrompt = {
    role: 'user',
    content: `${selectedPrompt?.value}: \n\n ${selectedText}`
  }

  const response = await twService.post('/protected/process-text', {
    text: userPrompt.content,
    mode
  })

  return response.data?.processedText || ''
}
