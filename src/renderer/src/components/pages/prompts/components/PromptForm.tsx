import { Input, Textarea } from '@chakra-ui/react'
import { DrawerFull } from '../../../ui/Drawer'
import { useEffect, useMemo, useState } from 'react'
import { GoPencil } from 'react-icons/go'
import { usePromptsContext } from './PromptsContext'
import { useCreatePrompt } from '@renderer/hooks/useCreatePrompt'
import { useUpdatePrompt } from '@renderer/hooks/useUpdatePrompt'
import { usePrompts } from '@renderer/hooks/usePrompts'


export const PromptForm = () => {

  const { editingId, setEditingId } = usePromptsContext()
  const { data: prompts, isLoading: isFetching } = usePrompts()
  const { mutate: createPrompt, isPending: isCreating } = useCreatePrompt({
    onSuccess: () => {
      setEditingId(null)
    }
  })
  const { mutate: updatePrompt, isPending: isUpdating } = useUpdatePrompt({
    id: editingId ?? undefined,
    onSuccess: () => {
      setEditingId(null)
    }
  })

  const initialValue = useMemo(() => {
    if (!editingId) return { label: '', prompt: '' }
    const prompt = prompts?.find((item) => item.ID == editingId)
    return {
      label: prompt?.label || '',
      prompt: prompt?.value || ''

    }
  }, [editingId, prompts])

  const isCreate = editingId === 'new'

  const [localPrompt, setLocalPrompt] = useState(initialValue)


  const handleConfirm = () => {
    const newPrompt = {
      ...localPrompt,
      value: localPrompt.prompt,
      label: localPrompt.label
    }
    if (isCreate) {
      createPrompt?.(newPrompt)
      return
    }
    updatePrompt(newPrompt)
  }

  const handleClose = () => {
    setEditingId(null)
  }


  useEffect(() => {
    if (editingId) {
      setLocalPrompt(initialValue)
    }
  }, [editingId])

  const isLoading = isFetching || isCreating || isUpdating

  return (
    <DrawerFull
      open={!!editingId}
      onConfirm={handleConfirm}
      cancelLabel="Cancel & return"
      onCancel={handleClose}
      icon={GoPencil}
      title={isCreate ? 'Add new prompt' : 'Edit prompt'}
      confirmLabel={isCreate ? 'Create' : 'Update'}
      isLoading={isLoading}
    >
      <Input
        value={localPrompt.label}
        onChange={(e) => {
          setLocalPrompt({ ...initialValue, ...localPrompt, label: e.target.value })
        }}
        my="1"
        placeholder="Prompt title"
        variant="subtle"
      />
      <Textarea
        value={localPrompt.prompt}
        onChange={(e) => {
          setLocalPrompt({ ...initialValue, ...localPrompt, prompt: e.target.value })
        }}
        my="1"
        variant="subtle"
        placeholder="Prompt details"
        height={110}
      />
    </DrawerFull>
  )
}
