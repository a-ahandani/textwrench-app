import { IconButton } from '@chakra-ui/react'
import { usePromptsContext } from './PromptsContext'
import { GoPlus } from 'react-icons/go'

export const CreateNewPromptButton = ({ ...rest }) => {
  const { setEditingId } = usePromptsContext()

  return (
    <IconButton
      size="lg"
      borderRadius="full"
      {...rest}
      onClick={() => {
        setEditingId('new')
      }}
      aria-label="Create new prompt"
      variant="solid"
      colorPalette="bg.muted"
      color="orange.300"
    >
      <GoPlus />
    </IconButton>
  )
}
