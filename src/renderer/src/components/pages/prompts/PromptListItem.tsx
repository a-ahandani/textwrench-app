import { Box, ProgressRoot } from '@chakra-ui/react'
import { RadioCardItem } from '../../ui/RadioCard'
import { useState } from 'react'
import { GoPencil } from 'react-icons/go'
import { useUpdatePrompt } from '@renderer/hooks/useUpdatePrompt'
import { ProgressBar } from '../../ui/Progress'
import { PromptForm } from './PromptForm'
import { Button } from '@renderer/components/ui/Button'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  value: string
  prompt: string
}

export const PromptListItem = ({ onChange, label, value, prompt }: PromptListProps) => {
  const [open, setOpen] = useState(false)

  const { mutate: updatePrompt, isPending } = useUpdatePrompt({
    id: value,
    onSuccess: () => {
      setOpen(false)
    }
  })

  const handleModalOpen = () => {
    setOpen(!open)
  }

  const handleConfirm = (prompt) => {
    updatePrompt({
      value: prompt.prompt,
      label: prompt.label
    })
    setOpen(false)
  }

  return (
    <>
      <RadioCardItem
        width="full"
        indicatorPlacement="start"
        label={
          <Box display="flex" width="100%">
            {isPending && (
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
            <Button variant="ghost" size="xs" onClick={handleModalOpen}>
              <GoPencil />
              Edit Prompt
            </Button>
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
        isLoading={isPending}
        initialValue={{ label, value: prompt }}
        onSubmit={handleConfirm}
        onClose={handleModalOpen}
      />
    </>
  )
}
