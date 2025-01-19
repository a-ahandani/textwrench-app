export type OptionType = {
  value: string
  label: string | undefined
  ID: string
}

export type UserProfile = {
  name: string
  email: string
  ID: string
}

export enum DataTypes {
  Prompts = 'prompts',
  Profile = 'profile'
}

export type StoreType = {
  selectedText?: string | null
  selectedPrompt?: string | null
  token?: string | null
  [DataTypes.Prompts]?: OptionType[] | null
}
