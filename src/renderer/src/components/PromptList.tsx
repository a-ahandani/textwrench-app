import { Box, DataListRoot, Group, Input, Kbd, RadioCardLabel } from '@chakra-ui/react'
import { RadioCardRoot } from './ui/RadioCard'
import { PromptListItem } from './PromptListItem'
import { useStore } from '../hooks/useStore'
import { SkeletonText } from './ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from './ui/InputGroup'
import { usePrompts } from '@renderer/hooks/usePrompts'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
}
export const PromptList = ({ label }: PromptListProps) => {
  const { data: prompts, isLoading } = usePrompts()
  const { setValue: setSelectedPrompt, value: selectedPrompt } = useStore<number>({
    key: 'selectedPrompt'
  })

  const handleChange = (e) => {
    const promptId = e?.target?.value
    setSelectedPrompt(promptId)
  }

  console.log('selectedPrompt', selectedPrompt)
  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot unstyled>
          <InputGroup width="full" mb="2" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
            <Input variant="flushed" placeholder="Search prompts" />
          </InputGroup>
          <RadioCardRoot
            size="sm"
            variant="surface"
            onChange={handleChange}
            value={String(selectedPrompt || prompts?.[0]?.ID)}
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
    </Box>
  )
}
