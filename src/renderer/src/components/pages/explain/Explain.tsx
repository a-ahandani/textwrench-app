import { Card, Heading } from '@chakra-ui/react'
import { Bs0Circle } from 'react-icons/bs'
import { DrawerFull } from '../../ui/Drawer'
import { useModal } from '@renderer/components/providers/ModalProvider'
import Markdown from 'react-markdown'

export const Explain = () => {
  const { isOpen: open, setIsOpen, content } = useModal()

  const handleClick = (): void => {
    setIsOpen(false)
  }
  return (
    <div>
      <DrawerFull open={open} onCancel={handleClick} icon={Bs0Circle} title={'Explain'}>
        <Card.Root>
          <Card.Header />
          <Card.Body>
            <Markdown
              components={{
                h1: (props) => (
                  <Heading style={{ fontSize: '3.5em', marginBottom: '1em' }} {...props} />
                ),
                h2: (props) => (
                  <Heading style={{ fontSize: '2.5em', marginBottom: '1em' }} {...props} />
                ),
                h3: (props) => (
                  <Heading style={{ fontSize: '2em', marginBottom: '0.7em' }} {...props} />
                ),
                ul: (props) => (
                  <ul style={{ listStyleType: 'disc', margin: '0 0 1.5em 1.5em' }} {...props} />
                ),
                ol: (props) => (
                  <ol style={{ listStyleType: 'decimal', margin: '0 0 1.5em 1.5em' }} {...props} />
                ),
                p: (props) => <p style={{ margin: '0 0 1.1em 0' }} {...props} />
              }}
            >
              {content}
            </Markdown>
          </Card.Body>
          <Card.Footer />
        </Card.Root>
      </DrawerFull>
    </div>
  )
}
