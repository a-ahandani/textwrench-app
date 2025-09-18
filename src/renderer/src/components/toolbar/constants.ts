import { ExplainPanel } from './components/Explain/ExplainPanel'

export interface PanelConfig {
  render: () => JSX.Element
  width?: number
  height?: number
}

export const PANEL_KEYS = {
  EXPLAIN: 'explain'
} as const

export type PanelKey = (typeof PANEL_KEYS)[keyof typeof PANEL_KEYS]

export const PANEL_REGISTRY: Record<PanelKey, PanelConfig> = {
  [PANEL_KEYS.EXPLAIN]: {
    width: 640,
    height: 410,
    render: ExplainPanel
  }
}

export const PANEL_KEY_LIST = Object.values(PANEL_KEYS)
