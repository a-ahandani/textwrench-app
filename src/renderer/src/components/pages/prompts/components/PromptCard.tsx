import { Box, Button, Card, IconButton } from '@chakra-ui/react'
import { Prompt } from '@shared/types/store'
import { useState } from 'react'
import { usePromptsContext } from './PromptsContext'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'
import { DeleteConfirmation } from './DeleteConfirmation'
import { GoTrash, GoPin, GoPencil } from 'react-icons/go'
import { Tooltip } from '@renderer/components/ui/Tooltip'

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
          xl: 'calc(50% - 5px)',
          '2xl': 'calc(33.33% - 6px)'
          // '2xl': 'calc(20% - 7px)'
        }}
        key={prompt.ID}
      >
        <Card.Header fontWeight="bold" pb={0} pt={4}>
          {prompt.label}
        </Card.Header>
        <Card.Body py={1} fontSize="sm" fontWeight={'light'}>
          {prompt.value}
        </Card.Body>
        <Card.Footer pt={1} pb={4}>
          <Box flex="1">
            <Button
              colorPalette="blue"
              size={'xs'}
              variant="solid"
              onClick={handleEditModalModalOpen}
            >
              <GoPencil />
              Edit
            </Button>
          </Box>
          <Tooltip content={isDefaultPrompt ? 'Default prompt' : 'Set as default prompt'}>
            <IconButton
              variant={isDefaultPrompt ? 'solid' : 'ghost'}
              colorPalette={isDefaultPrompt ? 'green' : 'gray'}
              size="xs"
              disabled={isDefaultPrompt}
              onClick={handleSelectPrompt}
              aria-label={isDefaultPrompt ? 'Default prompt' : 'Set as Default'}
            >
              <GoPin />
            </IconButton>
          </Tooltip>
          <Tooltip content="Delete prompt">
            <IconButton
              variant="ghost"
              size="xs"
              onClick={handleDeleteConfirmationOpen}
              aria-label="Delete prompt"
            >
              <GoTrash />
            </IconButton>
          </Tooltip>
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
