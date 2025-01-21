import { Box, DataListRoot, Flex, Group, Input, RadioCardLabel } from '@chakra-ui/react'
import { RadioCardRoot } from '../../ui/RadioCard'
import { PromptListItem } from './PromptListItem'
import { useStore } from '../../../hooks/useStore'
import { SkeletonText } from '../../ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '../../ui/InputGroup'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { Prompt } from '@shared/types/store'
import { useState } from 'react'
import { Button } from '@renderer/components/ui/Button'
import { GoPlus } from 'react-icons/go'
import { PromptForm } from './PromptForm'
import { useCreatePrompt } from '@renderer/hooks/useCreatePrompt'

type PromptListProps = {
  label?: string
}

export const PromptList = ({ label }: PromptListProps) => {
  const [term, setTerm] = useState<string>('')
  const [open, setOpen] = useState(false)

  const { mutate: createPrompt, isPending } = useCreatePrompt({
    onSuccess: () => {
      setOpen(false)
    }
  })

  const { data: prompts, isLoading } = usePrompts({
    term
  })

  const { setValue: setSelectedPrompt, value: selectedPrompt } = useStore<Prompt>({
    key: 'selectedPrompt'
  })

  const handleChange = (e) => {
    const promptId = e?.target?.value
    const prompt = prompts?.find((item) => item.ID == promptId)
    setSelectedPrompt(prompt)
  }

  const handleSubmitNewPrompt = (prompt: Partial<Prompt>) => {
    createPrompt(prompt)
    setOpen(false)
  }

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot unstyled>
          <Flex align={'center'} justify={'space-between'} mb={2}>
            <InputGroup
              width="full"
              mb="2"
              startElement={<LuSearch />}
              endElement={
                <Button
                  onClick={() => {
                    setOpen(true)
                  }}
                  size="xs"
                  variant="solid"
                  colorPalette="green"
                >
                  <GoPlus /> Add Prompt
                </Button>
              }
            >
              <Input
                variant="subtle"
                placeholder="Search prompts"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                }}
              />
            </InputGroup>
          </Flex>

          <RadioCardRoot
            size="sm"
            variant="surface"
            onChange={handleChange}
            value={String(selectedPrompt?.ID || prompts?.[0]?.ID)}
          >
            <RadioCardLabel>{label}</RadioCardLabel>
            <Group attached orientation="vertical">
              {prompts?.map((item) => (
                <PromptListItem
                  key={item.ID}
                  value={String(item.ID)}
                  label={item.label}
                  prompt={item.value}
                />
              ))}
            </Group>
          </RadioCardRoot>
        </DataListRoot>
      )}
      <PromptForm
        isLoading={isPending}
        open={open}
        onSubmit={handleSubmitNewPrompt}
        onClose={() => setOpen(false)}
      />
    </Box>
  )
}
