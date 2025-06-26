import { Button, IconButton, RadioCard } from '@chakra-ui/react'
import { Prompt } from '@shared/types/store'
import { useState } from 'react'
import { usePromptsContext } from './PromptsContext'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'
import { DeleteConfirmation } from './DeleteConfirmation'
import { GoTrash, GoPencil } from 'react-icons/go'
import { Tooltip } from '@renderer/components/ui/Tooltip'

export const PromptCard = ({ prompt, ...rest }: { prompt: Prompt }): JSX.Element => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { setEditingId } = usePromptsContext()

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

  return (
    <RadioCard.Item value={prompt.ID} {...rest}>
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl alignItems={'center'} display={'flex'} p={2}>
        <RadioCard.ItemIndicator />
        <RadioCard.ItemText fontWeight="bold">{prompt.label}</RadioCard.ItemText>
        <RadioCard.ItemDescription p={0}>
          <Button size={'xs'} variant="ghost" onClick={handleEditModalModalOpen}>
            <GoPencil />
            Edit
          </Button>
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
        </RadioCard.ItemDescription>
      </RadioCard.ItemControl>
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onSubmit={handleDelete}
        label={prompt.label}
        onClose={handleDeleteConfirmationOpen}
      />
      <RadioCard.ItemAddon fontSize="sm" fontWeight={'light'}>
        {prompt.value}
      </RadioCard.ItemAddon>
    </RadioCard.Item>
  )
}
