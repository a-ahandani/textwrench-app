import { Box, Button, Input, Textarea } from '@chakra-ui/react'
import { RadioCardItem } from './ui/RadioCard'
import { DrawerFull } from './Drawer'
import { useState } from 'react'
import { GoPencil } from 'react-icons/go'

type PromptListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  value: string
}
export const PromptListItem = ({ onChange, label, value }: PromptListProps) => {
  const [open, setOpen] = useState(false)

  const handleModalOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      <RadioCardItem
        width="full"
        indicatorPlacement="start"
        label={
          <Box display="flex" width="100%">
            <Box flex="1" display="flex" alignItems={'center'}>
              {label}
            </Box>
            <Button variant="ghost" size="xs" onClick={handleModalOpen}>
              <GoPencil />
              Edit Prompt
            </Button>
          </Box>
        }
        key={value}
        value={value}
        onChange={() => {
          onChange?.(value)
        }}
      />
      <DrawerFull
        open={open}
        onConfirm={handleModalOpen}
        onCancel={handleModalOpen}
        icon={GoPencil}
        title={'Edit Prompt'}
      >
        <Input value={label} my="1" placeholder="Prompt title" variant="subtle" />
        <Textarea value={value} my="1" variant="subtle" placeholder="Prompt details" height={110} />
      </DrawerFull>
    </>
  )
}
