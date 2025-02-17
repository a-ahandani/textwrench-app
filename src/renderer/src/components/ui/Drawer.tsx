import { Box, Drawer as ChakraDrawer, IconButton, Portal, ProgressRoot } from '@chakra-ui/react'
import * as React from 'react'
import { GoCheck, GoArrowLeft } from 'react-icons/go'
import { ProgressBar } from './Progress'
import { Button } from '@renderer/components/ui/Button'
import { Tooltip } from './Tooltip'

interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  offset?: ChakraDrawer.ContentProps['padding']
}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const { children, portalled = true, portalRef, offset, ...rest } = props
    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraDrawer.Positioner padding={offset}>
          <ChakraDrawer.Content ref={ref} {...rest} asChild={false}>
            {children}
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    )
  }
)

type DrawerFullProps = {
  open: boolean
  onConfirm?: VoidFunction
  onCancel?: VoidFunction
  children: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  title?: string
  icon?: React.ComponentType
  isLoading?: boolean
  confirmButtonProps?: React.ComponentProps<typeof Button>
  confirmIcon?: React.ComponentType
}

export const DrawerFull = ({
  open,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  children,
  title,
  icon: Icon,
  isLoading,
  confirmButtonProps,
  confirmIcon: ConfirmIcon = GoCheck
}: DrawerFullProps) => (
  <DrawerRoot open={open} placement="bottom" size="full">
    <DrawerBackdrop />
    <DrawerContent>
      {title && (
        <DrawerHeader pt="10" pb="2">
          {isLoading && (
            <ProgressRoot shape="square" variant="subtle" animated value={null} size="xs" mb={2}>
              <ProgressBar />
            </ProgressRoot>
          )}
          <DrawerTitle>
            <Box display="flex" alignItems="center">
              {Icon && <Icon />}
              <Box ml={2} flex={'1'}>
                {title}
              </Box>
              {onCancel && (
                <Tooltip content={cancelLabel} aria-label={cancelLabel}>
                  <IconButton onClick={onCancel} size="sm" aria-label={cancelLabel} variant="ghost">
                    <GoArrowLeft />
                  </IconButton>
                </Tooltip>
              )}
              {onConfirm && (
                <Button
                  ml={2}
                  aria-label={confirmLabel}
                  size="sm"
                  variant="solid"
                  colorPalette="green"
                  onClick={onConfirm}
                  {...confirmButtonProps}
                >
                  <ConfirmIcon />
                  {confirmLabel}
                </Button>
              )}
            </Box>
          </DrawerTitle>
        </DrawerHeader>
      )}
      <DrawerBody>{children}</DrawerBody>
    </DrawerContent>
  </DrawerRoot>
)

export const DrawerTrigger = ChakraDrawer.Trigger
export const DrawerRoot = ChakraDrawer.Root
export const DrawerFooter = ChakraDrawer.Footer
export const DrawerHeader = ChakraDrawer.Header
export const DrawerBody = ChakraDrawer.Body
export const DrawerBackdrop = ChakraDrawer.Backdrop
export const DrawerDescription = ChakraDrawer.Description
export const DrawerTitle = ChakraDrawer.Title
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger
