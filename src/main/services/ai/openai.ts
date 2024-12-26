import OpenAI from 'openai'

export const openAiClient = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
})

export const processTextWithAI = async (text: string): Promise<string> => {
  const chatCompletion = await openAiClient.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: `Revise the following text to correct grammar, spelling, and style. Provide only the revised text without any explanation or additional content:\n\n${text}`
      }
    ],
    max_tokens: 110,
    temperature: 0,
    model: 'gpt-4o-mini'
  })

  return chatCompletion.choices[0].message.content || ''
}
