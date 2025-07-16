import { Box, Card } from '@chakra-ui/react'
import { BsClipboard } from 'react-icons/bs'
import { useState } from 'react'
import { useStore } from '@renderer/hooks/useStore'
import { CreateNewPromptButton } from '../prompts/components/CreateNewPromptButton'
import { DrawerFull } from '@renderer/components/ui/Drawer'

export const Clipboard = () => {
  const { value: selectedText } = useStore<string>({
    key: 'selectedText'
  })
  const [open, setOpen] = useState(false)

  const handleClick = (): void => {
    setOpen(!open)
  }

  return (
    <div>
      <Box
        css={{
          position: 'fixed',
          bottom: '15px',
          left: '10px',
          zIndex: 2
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CreateNewPromptButton />
        <Box
          fontSize={10}
          ml={2}
          color={'gray.800'}
          textShadow={'0 1px 2px rgba(256, 256, 256, 0.5)'}
          cursor="pointer"
        >
          Create New Prompt
        </Box>
      </Box>
      {/* <IconButton
        variant="solid"
        colorPalette="bg.muted"
        color="orange.300"
        rounded="full"
        size={'xs'}
        css={{
          position: 'absolute',
          bottom: '65px',
          left: 4,
          zIndex: 12
        }}
        aria-label="Settings"
        onClick={handleClick}
      >
        <BsClipboard />
      </IconButton> */}
      <DrawerFull open={open} onCancel={handleClick} icon={BsClipboard} title={'Clipboard'}>
        <Box p={5}>
          <Card.Root>
            <Card.Header />
            <Card.Body>{selectedText}</Card.Body>
            <Card.Footer />
          </Card.Root>
        </Box>
      </DrawerFull>
    </div>
  )
}
