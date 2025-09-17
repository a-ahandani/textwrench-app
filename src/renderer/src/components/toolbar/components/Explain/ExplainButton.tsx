import { Button } from '@chakra-ui/react'
import { memo } from 'react'
import { MdOutlineLightbulb } from 'react-icons/md'
import { IPC_EVENTS } from '@shared/ipc-events'
import { PANEL_REGISTRY, PANEL_KEYS } from '../../constants'

export const ExplainButton = memo(function ExplainButton(): JSX.Element {
  const handleClick = (): void => {
    const ipc = window.electron?.ipcRenderer
    const panelKey = PANEL_KEYS.EXPLAIN
    const cfg = PANEL_REGISTRY[panelKey]
    ipc?.send(IPC_EVENTS.TOOLBAR_EXPAND, {
      action: 'open',
      panel: panelKey,
      width: cfg?.width,
      height: cfg?.height
    })
    window.dispatchEvent(new CustomEvent('toolbar:open-panel', { detail: { panel: panelKey } }))
  }

  return (
    <Button size="xs" variant="subtle" onClick={handleClick}>
      <MdOutlineLightbulb />
      Explain
    </Button>
  )
})
