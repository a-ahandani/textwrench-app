import { Box, DataListRoot, Group, RadioCardLabel } from '@chakra-ui/react'
import { RadioCardRoot } from './ui/RadioCard'
import { PromptListItem } from './PromptListItem'
import { useStore } from '../hooks/useStore'
import { OptionType } from 'src/shared/types/store'
import { SkeletonText } from './ui/Skeleton'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
}
export const PromptList = ({ label }: PromptListProps) => {
  const { value: options, isLoading } = useStore<OptionType[]>({
    key: 'prompts'
  })
  const { setValue: setSelectedPrompt } = useStore({ key: 'selectedPrompt' })

  const handleChange = (value: string) => {
    setSelectedPrompt(value)
  }

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot>
          <RadioCardRoot size="sm" variant="outline" defaultValue={options?.[0]?.value || ''}>
            <RadioCardLabel>{label}</RadioCardLabel>
            <Group attached orientation="vertical">
              {options?.map((item) => (
                <PromptListItem
                  key={item.id}
                  value={item.value}
                  label={item.label}
                  onChange={handleChange}
                />
              ))}
            </Group>
          </RadioCardRoot>
        </DataListRoot>
      )}
    </Box>
  )
}
