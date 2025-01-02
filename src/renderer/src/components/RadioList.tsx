import { Box, DataListRoot, Group, RadioCardLabel } from '@chakra-ui/react'
import { RadioCardItem, RadioCardRoot } from './RadioCard'
import { useStore } from '@renderer/hooks/useStore'

type RadioListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
}
export const RadioList = ({ options, onChange, label }: RadioListProps) => {
  const { value: selectedText } = useStore<string>({
    key: 'selectedText'
  })

  return (
    <Box>
      Selected text: {selectedText}
      <DataListRoot>
        <RadioCardRoot
          size="sm"
          variant="outline"
          colorPalette="teal"
          defaultValue={options?.[0]?.value || ''}
        >
          <RadioCardLabel>{label}</RadioCardLabel>
          <Group attached orientation="vertical">
            {options?.map((item) => (
              <RadioCardItem
                width="full"
                // addon={<div>sss</div>}
                label={item.label}
                key={item.value}
                value={item.value}
                onChange={() => {
                  onChange?.(item.value)
                }}
              />
            ))}
          </Group>
        </RadioCardRoot>
      </DataListRoot>
    </Box>
  )
}
