import Store, { type Options } from 'electron-store'
import { StoreType } from '../../shared/types/store'

const store = new Store<StoreType>({
  defaults: {
    delay: 50,
    token: null,
    authStartAt: null,
    authState: null,
    selectedText: '',
    selectedPrompt: undefined
  } as StoreType
}) as Options<StoreType>

export { store }
