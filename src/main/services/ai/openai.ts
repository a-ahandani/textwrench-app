import OpenAI from 'openai'
import {
  AI_MODELS,
  Roles,
  SYSTEM_PROMPT_KEYS,
  SYSTEM_PROMPTS,
  USER_PROMPTS_KEYS,
  USER_PROMPTS
} from './constants'

export const openAiClient = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
})

export const processTextWithAI = async (text: string): Promise<string> => {
  const systemPrompt = {
    role: Roles.System,
    content: SYSTEM_PROMPTS[SYSTEM_PROMPT_KEYS.DEFAULT]
  }

  const userPrompt = {
    role: Roles.User,
    content: `${USER_PROMPTS[USER_PROMPTS_KEYS.GRAMMAR]}: \n\n ${text}`
  }

  const chatCompletion = await openAiClient.chat.completions.create({
    messages: [userPrompt, systemPrompt],
    temperature: 0,
    model: AI_MODELS.GPT4_MINI,
    response_format: { type: 'text' }
  })

  return chatCompletion.choices[0].message.content || ''
}
