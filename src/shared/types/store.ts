export type Prompt = {
  value: string
  label: string | undefined
  ID: string
}

export type UserProfile = {
  user_type: string
  name: string
  email: string
  ID: string
}

export type StoreType = {
  appVersion?: string
  selectedText?: string | null
  selectedPrompt?: Prompt
  token?: string | null
}
