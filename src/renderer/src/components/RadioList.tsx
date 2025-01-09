import { Box, Button, DataListRoot, Group, Input, RadioCardLabel, Textarea } from '@chakra-ui/react'
import { RadioCardItem, RadioCardRoot } from './RadioCard'
import { DrawerFull } from './Drawer'
import { useStore } from '@renderer/hooks/useStore'
import { useState } from 'react'
import { GoPencil } from 'react-icons/go'

type RadioListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
}
export const RadioList = ({ options, onChange, label }: RadioListProps) => {
  const { value: selectedText } = useStore<string>({
    key: 'selectedText'
  })

  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <Box>
      Selected text: {selectedText}
      <DataListRoot>
        <RadioCardRoot size="sm" variant="outline" defaultValue={options?.[0]?.value || ''}>
          <RadioCardLabel>{label}</RadioCardLabel>
          <Group attached orientation="vertical">
            {options?.map((item) => (
              <RadioCardItem
                width="full"
                indicatorPlacement="start"
                label={
                  <Box display="flex" width="100%">
                    <Box flex="1" display="flex" alignItems={'center'}>
                      {item.label}
                    </Box>
                    <Button variant="ghost" size="xs" onClick={handleClick}>
                      <GoPencil />
                      Edit Prompt
                    </Button>
                  </Box>
                }
                key={item.value}
                value={item.value}
                onChange={() => {
                  onChange?.(item.value)
                }}
              />
            ))}
          </Group>
        </RadioCardRoot>
      </DataListRoot>{' '}
      <DrawerFull
        open={open}
        onConfirm={handleClick}
        onCancel={handleClick}
        icon={GoPencil}
        title={'Edit Prompt'}
      >
        <Input my="1" placeholder="Prompt title" variant="subtle" />
        <Textarea my="1" variant="subtle" placeholder="Prompt details" height={110} />
      </DrawerFull>
    </Box>
  )
}
