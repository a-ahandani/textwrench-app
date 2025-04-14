import { Button, ButtonGroup, Card } from '@chakra-ui/react'
import { Prompt } from '@shared/types/store'
import { useState } from 'react'
import { usePromptsContext } from './PromptsContext'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'
import { DeleteConfirmation } from './DeleteConfirmation'

export const PromptCard = ({ prompt }: { prompt: Prompt }): JSX.Element => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { setEditingId, setDefaultPrompt, defaultPrompt } = usePromptsContext()

  const { mutate: deletePrompt } = useDeletePrompt({
    id: prompt.ID,
    onSuccess: () => {
      setEditingId(null)
    }
  })

  const handleEditModalModalOpen = (): void => {
    setEditingId(prompt.ID)
  }

  const handleDeleteConfirmationOpen = (): void => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleDelete = (): void => {
    deletePrompt()
  }

  const handleSelectPrompt = (): void => {
    setDefaultPrompt(prompt)
  }

  const isDefaultPrompt = defaultPrompt?.ID == prompt.ID
  return (
    <>
      <Card.Root
        boxShadow={isDefaultPrompt ? 'inset 0 0 0 1px var(--chakra-colors-green-500)' : 'none'}
        width={{
          base: '100%',
          md: 'calc(50% - 5px)',
          xl: 'calc(33.33% - 6px)',
          '2xl': 'calc(20% - 7px)'
        }}
        key={prompt.ID}
      >
        <Card.Header fontWeight="bold" pb={0}>
          {prompt.label}
        </Card.Header>
        <Card.Body py={1} fontSize="sm" fontWeight={'light'}>
          {prompt.value}
        </Card.Body>
        <Card.Footer pt={1}>
          <ButtonGroup size="xs" variant="subtle" attached>
            <Button colorPalette="blue" variant="solid" onClick={handleEditModalModalOpen}>
              Edit
            </Button>
            <Button
              disabled={isDefaultPrompt}
              variant={isDefaultPrompt ? 'solid' : 'subtle'}
              colorPalette={isDefaultPrompt ? 'green' : 'black'}
              onClick={handleSelectPrompt}
            >
              {isDefaultPrompt ? 'Default prompt' : 'Set as Default'}
            </Button>{' '}
            <Button colorPalette="red" variant="subtle" onClick={handleDeleteConfirmationOpen}>
              Delete
            </Button>
          </ButtonGroup>
        </Card.Footer>
      </Card.Root>
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onSubmit={handleDelete}
        label={prompt.label}
        onClose={handleDeleteConfirmationOpen}
      />
    </>
  )
}
