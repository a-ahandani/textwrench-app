import React from 'react'
import { VStack, HStack, Text, IconButton, Spacer, Box } from '@chakra-ui/react'
import { MdClose } from 'react-icons/md'
import { IPC_EVENTS } from '@shared/ipc-events'

export interface PanelLayoutProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
  autoScroll?: boolean // if true wraps children in scroll box
  onClose?: () => void
}

export const PanelLayout: React.FC<PanelLayoutProps> = ({
  title,
  children,
  actions,
  footer,
  autoScroll = true,
  onClose
}) => {
  const handleClose = (): void => {
    if (onClose) onClose()
    const ipc = window.electron?.ipcRenderer
    ipc?.send(IPC_EVENTS.TOOLBAR_EXPAND, { action: 'close' })
    window.dispatchEvent(new CustomEvent('toolbar:open-panel', { detail: { panel: null } }))
  }

  return (
    <VStack gap={2} align="stretch" height="100vh" p={1} width="100%">
      <style>
        {`
        .tw-drag-region { -webkit-app-region: drag; }
        .tw-drag-region [data-no-drag] { -webkit-app-region: no-drag; }
        `}
      </style>
      <HStack
        gap={1}
        align="center"
        height={6}
        pl={2}
        userSelect="none"
        data-drag-region
        className="tw-drag-region"
        style={{ cursor: 'move' }}
      >
        <Text
          fontSize="xs"
          fontWeight="bold"
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          {title}
        </Text>
        {actions && (
          <Box data-no-drag display="flex" alignItems="center">
            {actions}
          </Box>
        )}
        <Spacer />
        <IconButton aria-label="Close" size="xs" variant="ghost" onClick={handleClose} data-no-drag>
          <MdClose />
        </IconButton>
      </HStack>
      <Box flex={1} overflow={autoScroll ? 'auto' : 'visible'} px={2} pb={footer ? 1 : 2}>
        {children}
      </Box>
      {footer && (
        <Box px={2} pb={1}>
          {footer}
        </Box>
      )}
    </VStack>
  )
}
