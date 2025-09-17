import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { memo } from 'react'
import { GoMoveToTop } from 'react-icons/go'
import { IPC_EVENTS } from '@shared/ipc-events'

export type ToggleExpandProps = Omit<IconButtonProps, 'aria-label' | 'onClick' | 'children'>

function ToggleExpandBase(props: ToggleExpandProps): JSX.Element {
  const handleClick = (): void => {
    const ipc = window.electron?.ipcRenderer
    ipc?.send(IPC_EVENTS.TOOLBAR_EXPAND, { action: 'toggle' })
  }

  return (
    <IconButton
      aria-label="Toggle toolbar expand"
      size="xs"
      variant="subtle"
      onClick={handleClick}
      {...props}
    >
      <GoMoveToTop />
    </IconButton>
  )
}

export const ToggleExpand = memo(ToggleExpandBase)
