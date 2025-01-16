import Store, { type Options } from 'electron-store'
import { StoreType } from '../../shared/types/store'

const store = new Store<StoreType>({
  defaults: {
    token: null,
    profile: null,
    selectedText: '',
    selectedPrompt: null,
    prompts: []
  }
}) as Options<StoreType>

export { store }
