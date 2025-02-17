import { Box, IconButton, ProgressRoot } from '@chakra-ui/react'
import { RadioCardItem } from '../../../ui/RadioCard'
import { useState } from 'react'
import { GoPencil, GoX } from 'react-icons/go'
import { useUpdatePrompt } from '@renderer/hooks/useUpdatePrompt'
import { ProgressBar } from '../../../ui/Progress'
import { PromptForm } from './PromptForm'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { DeleteConfirmation } from './DeleteConfirmation'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  value: string
  prompt: string
}

export const PromptListItem = ({ onChange, label, value, prompt }: PromptListProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { mutate: updatePrompt, isPending: isUpdating } = useUpdatePrompt({
    id: value,
    onSuccess: () => {
      setIsEditModalOpen(false)
    }
  })

  const { mutate: deletePrompt, isPending: isDeleting } = useDeletePrompt({
    id: value,
    onSuccess: () => {
      setIsEditModalOpen(false)
    }
  })

  const handleEditModalModalOpen = () => {
    setIsEditModalOpen(!isEditModalOpen)
  }

  const handleDeleteConfirmationOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleUpdate = (prompt) => {
    updatePrompt({
      value: prompt.prompt,
      label: prompt.label
    })
    setIsEditModalOpen(false)
  }

  const handleDelete = () => {
    deletePrompt()
  }

  return (
    <>
      <RadioCardItem
        width="full"
        indicatorPlacement="start"
        label={
          <Box display="flex" width="100%">
            {(isUpdating || isDeleting) && (
              <ProgressRoot
                position={'absolute'}
                top="0"
                left={0}
                width={'100%'}
                shape="square"
                variant="subtle"
                animated
                value={null}
                size="xs"
                height={1}
              >
                <ProgressBar height={1} />
              </ProgressRoot>
            )}
            <Box flex="1" display="flex" alignItems={'center'}>
              {label}
            </Box>
            <Tooltip content={'Delete'}>
              <IconButton
                colorPalette="red"
                onClick={handleDeleteConfirmationOpen}
                size="xs"
                variant="ghost"
              >
                <GoX />
              </IconButton>
            </Tooltip>
            <Tooltip content={'Edit Prompt'}>
              <IconButton
                colorPalette="blue"
                onClick={handleEditModalModalOpen}
                size="xs"
                variant="ghost"
              >
                <GoPencil />
              </IconButton>
            </Tooltip>
          </Box>
        }
        key={value}
        value={value}
        onChange={() => {
          onChange?.(value)
        }}
      />
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onSubmit={handleDelete}
        label={label}
        onClose={handleDeleteConfirmationOpen}
      />
      <PromptForm
        open={isEditModalOpen}
        isLoading={isUpdating}
        initialValue={{ label, value: prompt }}
        onSubmit={handleUpdate}
        onClose={handleEditModalModalOpen}
      />
    </>
  )
}
