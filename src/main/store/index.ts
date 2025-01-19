import Store, { type Options } from 'electron-store'
import { StoreType } from '../../shared/types/store'

const store = new Store<StoreType>({
  defaults: {
    token: null,
    selectedText: '',
    selectedPrompt: null,
    prompts: []
  } as StoreType
}) as Options<StoreType>

export { store }
