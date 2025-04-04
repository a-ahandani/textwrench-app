import { ACTIONS } from '../../shared/constants'
import { handleReviseText, handleExplainText, handleSelectPrompt } from './clipboard-handlers'

export const handlers = {
  [ACTIONS.CORRECT_TEXT]: handleReviseText,
  [ACTIONS.EXPLAIN_TEXT]: handleExplainText,
  [ACTIONS.SELECT_PROMPT]: handleSelectPrompt
}
