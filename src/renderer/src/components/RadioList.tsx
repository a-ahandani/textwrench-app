import { DataListRoot, Group, RadioCardLabel } from '@chakra-ui/react'
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
        <Group attached orientation="vertical">
          {options?.map((item) => (
            <RadioCardItem
              width="full"
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
  )
}
