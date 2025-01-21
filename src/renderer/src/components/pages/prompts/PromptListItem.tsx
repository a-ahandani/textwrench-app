import { Box, Group, ProgressRoot } from '@chakra-ui/react'
import { RadioCardItem } from '../../ui/RadioCard'
import { useState } from 'react'
import { GoPencil, GoX } from 'react-icons/go'
import { useUpdatePrompt } from '@renderer/hooks/useUpdatePrompt'
import { ProgressBar } from '../../ui/Progress'
import { PromptForm } from './PromptForm'
import { Button } from '@renderer/components/ui/Button'
import { useDeletePrompt } from '@renderer/hooks/useDeletePrompt'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  value: string
  prompt: string
}

export const PromptListItem = ({ onChange, label, value, prompt }: PromptListProps) => {
  const [open, setOpen] = useState(false)

  const { mutate: updatePrompt, isPending: isUpdating } = useUpdatePrompt({
    id: value,
    onSuccess: () => {
      setOpen(false)
    }
  })

  const { mutate: deletePrompt, isPending: isDeleting } = useDeletePrompt({
    id: value,
    onSuccess: () => {
      setOpen(false)
    }
  })

  const handleModalOpen = () => {
    setOpen(!open)
  }

  const handleUpdate = (prompt) => {
    updatePrompt({
      value: prompt.prompt,
      label: prompt.label
    })
    setOpen(false)
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
            <Group attached>
              <Button variant="subtle" color="red.400" size="xs" onClick={handleDelete}>
                <GoX />
              </Button>
              <Button variant="subtle" size="xs" onClick={handleModalOpen}>
                <GoPencil />
                Edit Prompt
              </Button>
            </Group>
          </Box>
        }
        key={value}
        value={value}
        onChange={() => {
          onChange?.(value)
        }}
      />
      <PromptForm
        open={open}
        isLoading={isUpdating}
        initialValue={{ label, value: prompt }}
        onSubmit={handleUpdate}
        onClose={handleModalOpen}
      />
    </>
  )
}
