import { Card, IconButton } from '@chakra-ui/react'
import { BsClipboard } from 'react-icons/bs'
import { DrawerFull } from './Drawer'
import { useState } from 'react'
import { useStore } from '@renderer/hooks/useStore'

export const Clipboard = () => {
  const { value: selectedText } = useStore<string>({
    key: 'selectedText'
  })
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <div>
      <IconButton
        variant="subtle"
        rounded="full"
        size={'sm'}
        css={{
          position: 'absolute',
          bottom: '10px',
          left: '15px',
          zIndex: 12
        }}
        aria-label="Settings"
        onClick={handleClick}
      >
        <BsClipboard />
      </IconButton>
      <DrawerFull open={open} onCancel={handleClick} icon={BsClipboard} title={'Clipboard'}>
        <Card.Root>
          <Card.Header />
          <Card.Body>{selectedText}</Card.Body>
          <Card.Footer />
        </Card.Root>
      </DrawerFull>
    </div>
  )
}
