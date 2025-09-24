import { ButtonGroup, Box } from '@chakra-ui/react'
import { FixIt } from './components/FixIt/FixItButton'
import { ExplainButton } from './components/Explain/ExplainButton'
import { PromptsButton } from './components/Prompts/PromptsButton'
import { useEffect, useState } from 'react'
import { PANEL_REGISTRY } from './constants'

function useToolbarPanels(): {
  activePanel: string | null
  setPanel: (id: string | null) => void
} {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  useEffect((): (() => void) => {
    const onOpen = (e: Event): void => {
      const detail = (e as CustomEvent).detail as { panel?: string | null }
      if (Object.prototype.hasOwnProperty.call(detail || {}, 'panel')) {
        setActivePanel(detail?.panel ?? null)
      }
    }
    const onReset = (): void => setActivePanel(null)
    window.addEventListener('toolbar:open-panel', onOpen as EventListener)
    const unsubscribeReset = window.api?.onToolbarResetUI?.(onReset)
    return () => {
      window.removeEventListener('toolbar:open-panel', onOpen as EventListener)
      if (unsubscribeReset) unsubscribeReset()
    }
  }, [])

  return { activePanel, setPanel: setActivePanel }
}

function ToolbarApp(): JSX.Element {
  const { activePanel } = useToolbarPanels()
  const ActivePanelComponent = activePanel ? PANEL_REGISTRY[activePanel]?.render : undefined
  return (
    <Box width="100%" height="100%" overflow="hidden" position="relative">
      <Box
        style={{
          transition: 'opacity 120ms ease, transform 140ms ease',
          opacity: !activePanel ? 1 : 0,
          transform: !activePanel ? 'translateY(0)' : 'translateY(-4px)',
          position: activePanel ? 'absolute' : 'relative',
          width: '100%',
          pointerEvents: !activePanel ? 'auto' : 'none'
        }}
      >
        {!activePanel && (
          <ButtonGroup width={'100%'} size={'xs'} variant="subtle" attached>
            <FixIt />
            <ExplainButton />
            <PromptsButton />
          </ButtonGroup>
        )}
      </Box>
      <Box
        style={{
          transition: 'opacity 140ms ease, transform 160ms ease',
          opacity: activePanel ? 1 : 0,
          transform: activePanel ? 'translateY(0)' : 'translateY(4px)',
          position: activePanel ? 'relative' : 'absolute',
          width: '100%',
          pointerEvents: activePanel ? 'auto' : 'none'
        }}
      >
        {ActivePanelComponent && <ActivePanelComponent />}
      </Box>
    </Box>
  )
}

export default ToolbarApp
