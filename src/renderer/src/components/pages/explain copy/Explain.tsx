import { Card, Heading } from '@chakra-ui/react'
import Markdown from 'react-markdown'

import { FC } from 'react'
import { useModal } from '@renderer/components/providers/ModalProvider'

export const Explain: FC = () => {
  const { content } = useModal()

  return (
    <Card.Root>
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
    </Card.Root>
  )
}
