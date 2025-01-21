import { Input, Textarea } from '@chakra-ui/react'
import { DrawerFull } from '../../ui/Drawer'
import { useState } from 'react'
import { GoPencil } from 'react-icons/go'
import { Prompt } from '@shared/types/store'

type PromptFormProps = {
  onSubmit?: (prompt: Partial<Prompt>) => void
  onClose?: () => void
  id?: string
  open: boolean
  isLoading?: boolean
  initialValue?: Partial<Prompt>
}

export const PromptForm = ({
  onSubmit,
  open,
  onClose,
  isLoading,
  initialValue
}: PromptFormProps) => {
  const isCreate = !initialValue

  const [localPrompt, setLocalPrompt] = useState({
    label: initialValue?.label || '',
    prompt: initialValue?.value || ''
  })

  const handleConfirm = () => {
    onSubmit?.({
      ...localPrompt,
      value: localPrompt.prompt,
      label: localPrompt.label
    })
  }

  return (
    <DrawerFull
      open={open}
      onConfirm={handleConfirm}
      onCancel={onClose}
      icon={GoPencil}
      title={isCreate ? 'Add new prompt' : 'Edit prompt'}
      isLoading={isLoading}
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
  )
}
