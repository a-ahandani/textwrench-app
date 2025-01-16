export type OptionType = {
  id: string
  value: string
  label: string
}

export type UserProfile = {
  name: string
  email: string
  ID: string
}

export type StoreType = {
  selectedText?: string
  selectedPrompt?: string
  prompts?: OptionType[]
  token?: string
  profile?: UserProfile
}
