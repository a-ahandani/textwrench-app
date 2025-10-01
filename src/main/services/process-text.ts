import { twService } from '../providers/axios'
import { AiMode } from '@shared/ai'
import { ProcessTextPayload, ProcessTextResponse } from './shared/types'
import {
  broadcastLimit,
  resolvePromptText,
  resolveMode,
  createUsageLimitPayload
} from './shared/utils'

export const processText = async (payload: ProcessTextPayload): Promise<string> => {
  const text = await resolvePromptText(payload)
  const mode = resolveMode(payload.mode, AiMode.Improve)

  const response = await twService.post('/protected/process-text', {
    text,
    mode
  })

  const data: ProcessTextResponse = response.data || {}
  const { processedText = '', allowed = true } = data

  if (!allowed) {
    broadcastLimit(createUsageLimitPayload(data))
    return ''
  }

  return processedText || ''
}
