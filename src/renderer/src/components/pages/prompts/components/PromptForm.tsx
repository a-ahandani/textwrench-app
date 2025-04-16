import { Box, Field, Input, Textarea } from '@chakra-ui/react'
import { DrawerFull } from '../../../ui/Drawer'
import { useEffect, useMemo, useState } from 'react'
import { GoPencil } from 'react-icons/go'
import { usePromptsContext } from './PromptsContext'
import { useCreatePrompt } from '@renderer/hooks/useCreatePrompt'
import { useUpdatePrompt } from '@renderer/hooks/useUpdatePrompt'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { useTemplates } from '@renderer/hooks/useTemplates'

export const PromptForm = (): JSX.Element => {
  const { editingId, setEditingId, templateId, setTemplateId } = usePromptsContext()
  const { data: prompts, isLoading: isFetchingPrompts } = usePrompts()
  const { data: templates, isLoading: isFetchingTemplates } = useTemplates()

  const { mutate: createPrompt, isPending: isCreating } = useCreatePrompt({
    onSuccess: () => {
      setEditingId(null)
      setTemplateId(null)
    }
  })
  const { mutate: updatePrompt, isPending: isUpdating } = useUpdatePrompt({
    id: editingId ?? undefined,
    onSuccess: () => {
      setEditingId(null)
      setTemplateId(null)
    }
  })

  const initialValue = useMemo(() => {
    if (!editingId && !templateId) return { label: '', prompt: '' }
    if (templateId) {
      const template = templates?.find((item) => item.ID == templateId)
      return {
        label: template?.label || '',
        prompt: template?.value || ''
      }
    }

    const prompt = prompts?.find((item) => item.ID == editingId)
    return {
      label: prompt?.label || '',
      prompt: prompt?.value || ''
    }
  }, [editingId, prompts, templateId, templates])

  const isCreate = editingId === 'new' || templateId

  const [localPrompt, setLocalPrompt] = useState(initialValue)

  const handleConfirm = (): void => {
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

  const handleClose = (): void => {
    setEditingId(null)
    setTemplateId(null)
  }

  useEffect(() => {
    if (editingId || templateId) {
      setLocalPrompt(initialValue)
    }
  }, [editingId, templateId])

  const isLoading = isFetchingPrompts || isFetchingTemplates || isCreating || isUpdating

  return (
    <DrawerFull
      open={!!editingId || !!templateId}
      onConfirm={handleConfirm}
      cancelLabel="Cancel & return"
      onCancel={handleClose}
      icon={GoPencil}
      title={
        isCreate ? (templateId ? 'Customize template & add' : 'Add new prompt') : 'Edit prompt'
      }
      confirmLabel={isCreate ? 'Add prompt' : 'Update'}
      isLoading={isLoading}
    >
      <Box p={5}>
        <Field.Root mb={6}>
          <Field.Label>Label </Field.Label>
          <Input
            value={localPrompt.label}
            onChange={(e) => {
              setLocalPrompt({ ...initialValue, ...localPrompt, label: e.target.value })
            }}
            my="1"
            placeholder="Prompt title"
            variant="subtle"
          />
          <Field.HelperText>
            This is the name of the prompt. It will be displayed in the list of prompts.
          </Field.HelperText>
        </Field.Root>
        <Field.Root>
          <Field.Label>Prompt</Field.Label>
          <Textarea
            value={localPrompt.prompt}
            onChange={(e) => {
              setLocalPrompt({ ...initialValue, ...localPrompt, prompt: e.target.value })
            }}
            my="1"
            variant="subtle"
            placeholder="Prompt details"
            height={190}
          />
        </Field.Root>
      </Box>
    </DrawerFull>
  )
}
