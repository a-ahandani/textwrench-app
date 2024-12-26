export const USER_PROMPTS_KEYS = {
  GRAMMAR: 'grammar',
  SUMMARIZATION: 'summarization',
  TRANSLATION: 'translation'
}

export const USER_PROMPTS_NAMES = {
  [USER_PROMPTS_KEYS.GRAMMAR]: 'Grammar Correction',
  [USER_PROMPTS_KEYS.SUMMARIZATION]: 'Summarization',
  [USER_PROMPTS_KEYS.TRANSLATION]: 'Translation'
}

export const USER_PROMPTS = {
  [USER_PROMPTS_KEYS.GRAMMAR]: 'Revise the following text to correct grammar, spelling, and style.',
  [USER_PROMPTS_KEYS.SUMMARIZATION]: 'Summarize the following text:',
  [USER_PROMPTS_KEYS.TRANSLATION]: 'Translate the following text to French:'
}

export const SYSTEM_PROMPT_KEYS = {
  DEFAULT: 'default'
}

export const SYSTEM_PROMPTS = {
  [SYSTEM_PROMPT_KEYS.DEFAULT]:
    'You are a text improvement assistant. Respond only with the improved version of the input text, without any explanations, comments, or additional content.'
}

export const AI_MODELS = {
  GPT3: 'gpt-3.5-turbo',
  GPT4_MINI: 'gpt-4o-mini'
}

export enum Roles {
  System = 'system',
  User = 'user'
}
