import Store, { type Options } from 'electron-store'

export type OptionType = {
  value: string
  label: string
}

export type StoreType = {
  selectedPrompt: string | null
  prompts: OptionType[]
}

const store = new Store<StoreType>({
  defaults: {
    selectedPrompt: null,
    prompts: []
  }
}) as Options<StoreType>

export { store }
