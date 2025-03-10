import { Box, DataListRoot, Flex, Group, IconButton, Input, RadioCardLabel } from '@chakra-ui/react'
import { RadioCardRoot } from '../../../ui/RadioCard'
import { PromptListItem } from './PromptListItem'
import { useStore } from '../../../../hooks/useStore'
import { SkeletonText } from '../../../ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '../../../ui/InputGroup'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { Prompt } from '@shared/types/store'
import { useState } from 'react'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { GoPlus } from 'react-icons/go'
import { PromptForm } from './PromptForm'
import { usePromptsContext } from './PromptsContext'

type PromptListProps = {
  label?: string
}

export const PromptList = ({ label }: PromptListProps) => {
  const { setEditingId } = usePromptsContext()
  const [term, setTerm] = useState<string>('')

  const { data: prompts, isLoading } = usePrompts({
    term
  })

  const { setValue: setSelectedPrompt, value: selectedPrompt } = useStore<Prompt>({
    key: 'selectedPrompt'
  })

  const handleSelectPrompt = (e) => {
    const promptId = e?.target?.value
    const prompt = prompts?.find((item) => item.ID == promptId)
    setSelectedPrompt(prompt)
  }

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot unstyled>
          <Flex alignItems={'center'} justifyContent={'center'} mb={2}>
            <InputGroup
              width="full"
              startElement={<LuSearch />}
              endElement={
                <Tooltip
                  content="Add Prompt"
                  aria-label="Add Prompt"
                  positioning={{ placement: 'left' }}
                >
                  <IconButton
                    onClick={() => {
                      setEditingId('new')
                    }}
                    colorPalette="green"
                    size="lg"
                    borderRadius={0}
                    aria-label="Add Prompt"
                    mr={-2}
                    variant="solid"
                  >
                    <GoPlus />
                  </IconButton>
                </Tooltip>
              }
            >
              <Input
                variant="subtle"
                _active={{
                  borderColor: 'transparent',
                  boxShadow: 'none'
                }}
                _focus={{
                  borderColor: 'transparent',
                  boxShadow: 'none'
                }}
                colorPalette="green"
                borderRadius={0}
                size={'lg'}
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
            onChange={handleSelectPrompt}
            value={String(selectedPrompt?.ID || prompts?.[0]?.ID)}
          >
            <RadioCardLabel>{label}</RadioCardLabel>
            <Group attached orientation="vertical">
              {prompts?.map((item) => (
                <PromptListItem key={item.ID} id={String(item.ID)} label={item.label} />
              ))}
            </Group>
          </RadioCardRoot>
        </DataListRoot>
      )}
      <PromptForm />
    </Box>
  )
}
