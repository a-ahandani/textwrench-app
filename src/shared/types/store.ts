export type Prompt = {
  value: string
  label: string | undefined
  ID: string
}

export type UserProfile = {
  name: string
  email: string
  ID: string
}

export type StoreType = {
  selectedText?: string | null
  selectedPrompt?: string | null
  token?: string | null
}
