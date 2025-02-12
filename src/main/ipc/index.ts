import { ACTIONS } from '../../shared/constants'
import { handleSelectedText } from './clipboard-handlers'

export const handlers = {
  [ACTIONS.FIX_SELECTED_TEXT]: handleSelectedText
}
