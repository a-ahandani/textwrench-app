import Store, { type Options } from 'electron-store'
import { StoreType } from '../../shared/types/store'

const store = new Store<StoreType>({
  defaults: {
    selectedPrompt: null,
    prompts: []
  }
}) as Options<StoreType>

export { store }
