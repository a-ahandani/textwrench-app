import { DataListRoot, RadioCardLabel, VStack } from '@chakra-ui/react'
import { RadioCardItem, RadioCardRoot } from './RadioCard'

type RadioListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
}
export const RadioList = ({ options, onChange, label }: RadioListProps) => {
  return (
    <DataListRoot>
      <RadioCardRoot defaultValue="next">
        <RadioCardLabel>{label}</RadioCardLabel>
        <VStack align="stretch">
          {options?.map((item) => (
            <RadioCardItem
              label={item.label}
              key={item.value}
              value={item.value}
              onSelect={() => onChange?.(item.value)}
            />
          ))}
        </VStack>
      </RadioCardRoot>
    </DataListRoot>
  )
}
