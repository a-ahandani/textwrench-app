import { Box, IconButton, ProgressRoot } from '@chakra-ui/react'
import { useState } from 'react'
import { GoPencil, GoX } from 'react-icons/go'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { RadioCardItem } from '@renderer/components/ui/RadioCard'
import { ProgressBar } from '@renderer/components/ui/Progress'

type TemplateListProps = {
  options?: Array<{ label: string; value: string }>
  onChange?: (value: string) => void
  label?: string
  id: string
  isLoading?: boolean
}

export const TemplateListItem = ({
  onChange,
  label,
  id,
  isLoading
}: TemplateListProps): JSX.Element => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDeleteConfirmationOpen = (): void => {
    setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  return (
    <>
      <RadioCardItem
        width="full"
        indicatorPlacement="start"
        label={
          <Box display="flex" width="100%">
            {isLoading && (
              <ProgressRoot
                position={'absolute'}
                top="0"
                left={0}
                width={'100%'}
                shape="square"
                variant="subtle"
                animated
                value={null}
                size="xs"
                height={1}
              >
                <ProgressBar height={1} />
              </ProgressRoot>
            )}
            <Box flex="1" display="flex" alignItems={'center'}>
              {label}
            </Box>
            <Tooltip content={'Delete'}>
              <IconButton
                colorPalette="red"
                onClick={handleDeleteConfirmationOpen}
                size="xs"
                variant="ghost"
              >
                <GoX />
              </IconButton>
            </Tooltip>
            <Tooltip content={'Edit Template'}>
              <IconButton colorPalette="blue" size="xs" variant="ghost">
                <GoPencil />
              </IconButton>
            </Tooltip>
          </Box>
        }
        value={id}
        onChange={() => {
          onChange?.(id)
        }}
      />
    </>
  )
}
