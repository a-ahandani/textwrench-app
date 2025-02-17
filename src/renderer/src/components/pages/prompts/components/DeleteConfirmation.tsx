import { DrawerFull } from '../../../ui/Drawer'
import { Prompt } from '@shared/types/store'
import { Card } from '@chakra-ui/react'
import { GoX } from 'react-icons/go'

type DeleteConfirmationProps = {
  onSubmit?: (prompt: Partial<Prompt>) => void
  onClose?: () => void
  id?: string
  open: boolean
  isLoading?: boolean
  label?: string
}

export const DeleteConfirmation = ({
  onSubmit,
  open,
  onClose,
  isLoading,
  label
}: DeleteConfirmationProps) => {
  const handleConfirm = () => {
    onSubmit?.({})
  }

  return (
    <DrawerFull
      open={open}
      onConfirm={handleConfirm}
      cancelLabel="Cancel & return"
      onCancel={onClose}
      title={' '}
      confirmLabel={'Delete'}
      isLoading={isLoading}
      confirmButtonProps={{ colorPalette: 'red' }}
      confirmIcon={GoX}
    >
      <Card.Root>
        <Card.Body>
          <Card.Description>
            Are you sure you want to delete this prompt? This action cannot be undone.
          </Card.Description>
          <Card.Title mt="2">&quot;{label}&quot;</Card.Title>
        </Card.Body>
      </Card.Root>
    </DrawerFull>
  )
}
