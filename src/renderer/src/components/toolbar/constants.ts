import { ExplainPanel } from './components/Explain/ExplainPanel'
import { PromptsPanel } from './components/Prompts/PromptsPanel'

export interface PanelConfig {
  render: () => JSX.Element
  width?: number
  height?: number
}

export const PANEL_KEYS = {
  EXPLAIN: 'explain',
  PROMPTS: 'prompts'
} as const

export type PanelKey = (typeof PANEL_KEYS)[keyof typeof PANEL_KEYS]

export const PANEL_REGISTRY: Record<PanelKey, PanelConfig> = {
  [PANEL_KEYS.EXPLAIN]: {
    width: 640,
    height: 440,
    render: ExplainPanel
  },
  [PANEL_KEYS.PROMPTS]: {
    width: 640,
    height: 440,
    render: PromptsPanel
  }
}

export const PANEL_KEY_LIST = Object.values(PANEL_KEYS)
