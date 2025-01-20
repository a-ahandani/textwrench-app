import { Box, Button, Input, ProgressRoot, Textarea } from '@chakra-ui/react'
import { RadioCardItem } from './ui/RadioCard'
import { DrawerFull } from './Drawer'
import { useState } from 'react'
import { GoPencil } from 'react-icons/go'
import { useUpdatePrompts } from '@renderer/hooks/useUpdatePrompts'
import { ProgressBar } from './ui/Progress'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  value: string
  prompt: string
}

export const PromptListItem = ({ onChange, label, value, prompt }: PromptListProps) => {
  const [open, setOpen] = useState(false)
  const [localPrompt, setLocalPrompt] = useState({ label, prompt })
  const { mutate: updatePrompt, isPending } = useUpdatePrompts({
    id: value,
    onSuccess: () => {
      setOpen(false)
    }
  })

  const handleModalOpen = () => {
    setOpen(!open)
  }

  const handleConfirm = () => {
    updatePrompt(localPrompt)
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
      <DrawerFull
        open={open}
        onConfirm={handleConfirm}
        onCancel={handleModalOpen}
        icon={GoPencil}
        title={'Edit Prompt'}
        isLoading={isPending}
      >
        <Input
          value={localPrompt.label}
          onChange={(e) => {
            setLocalPrompt({ ...localPrompt, label: e.target.value })
          }}
          my="1"
          placeholder="Prompt title"
          variant="subtle"
        />
        <Textarea
          value={localPrompt.prompt}
          onChange={(e) => {
            setLocalPrompt({ ...localPrompt, prompt: e.target.value })
          }}
          my="1"
          variant="subtle"
          placeholder="Prompt details"
          height={110}
        />
      </DrawerFull>
    </>
  )
}
