import { Box, IconButton, ProgressRoot } from '@chakra-ui/react'
import { RadioCardItem } from '../../../ui/RadioCard'
import { useState } from 'react'
import { GoPencil, GoX } from 'react-icons/go'
import { ProgressBar } from '../../../ui/Progress'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { DeleteConfirmation } from './DeleteConfirmation'
import { usePromptsContext } from './PromptsContext'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  id: string
  isLoading?: boolean
}

export const PromptListItem = ({
  onChange,
  label,
  id,
  isLoading
}: PromptListProps): JSX.Element => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const { setEditingId } = usePromptsContext()

  const { mutate: deletePrompt, isPending: isDeleting } = useDeletePrompt({
    id,
    onSuccess: () => {
      setEditingId(null)
    }
  })

  const handleEditModalModalOpen = (): void => {
    setEditingId(id)
  }

  const handleDeleteConfirmationOpen = (): void => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleDelete = (): void => {
    deletePrompt()
  }

  return (
    <>
      <RadioCardItem
        width="full"
        indicatorPlacement="start"
        label={
          <Box display="flex" width="100%">
            {(isLoading || isDeleting) && (
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
        value={id}
        onChange={() => {
          onChange?.(id)
        }}
      />
      <DeleteConfirmation
        open={isDeleteModalOpen}
        onSubmit={handleDelete}
        label={label}
        onClose={handleDeleteConfirmationOpen}
      />
    </>
  )
}
