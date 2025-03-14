import { Card, IconButton } from '@chakra-ui/react'
import { BsClipboard } from 'react-icons/bs'
import { DrawerFull } from '../../ui/Drawer'
import { useState } from 'react'
import { useStore } from '@renderer/hooks/useStore'

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
      <IconButton
        variant="subtle"
        rounded="full"
        size={'sm'}
        css={{
          position: 'absolute',
          bottom: '15px',
          left: '11px',
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
