import { ACTIONS } from '../../shared/constants'
import { handleReviseText, handleExplainText } from './clipboard-handlers'

export const handlers = {
  [ACTIONS.REVISE_TEXT]: handleReviseText,
  [ACTIONS.EXPLAIN_TEXT]: handleExplainText
}
