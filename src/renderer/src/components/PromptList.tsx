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
  const { setValue: setSelectedPrompt } = useStore({ key: 'selectedPrompt' })

  const handleChange = (value: string) => {
    setSelectedPrompt(value)
  }

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot unstyled>
          <InputGroup width="full" mb="2" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
            <Input variant="flushed" placeholder="Search prompts" />
          </InputGroup>
          <RadioCardRoot size="sm" variant="surface" defaultValue={prompts?.[0]?.value || ''}>
            <RadioCardLabel>{label}</RadioCardLabel>
            <Group attached orientation="vertical">
              {prompts?.map((item) => (
                <PromptListItem
                  key={item.ID}
                  value={item.ID}
                  label={item.label}
                  onChange={handleChange}
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
