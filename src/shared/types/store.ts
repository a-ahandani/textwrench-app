export type OptionType = {
  id: string
  value: string
  label: string
}

export type StoreType = {
  selectedText?: string
  selectedPrompt?: string
  prompts?: OptionType[]
}
