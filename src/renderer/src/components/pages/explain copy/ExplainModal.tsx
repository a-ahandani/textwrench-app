import { Bs0Circle } from 'react-icons/bs'
import { DrawerFull } from '../../ui/Drawer'
import { useModal } from '@renderer/components/providers/ModalProvider'

import { FC } from 'react'
import { Explain } from './Explain'
import { Prompts } from './Prompts'
import { MODAL_TITLES, ModalTypes } from '@shared/constants'

const MODAL_COMPONENTS = {
  [ModalTypes.EXPLAIN]: Explain,
  [ModalTypes.PROMPT]: Prompts
}

export const ExplainModal: FC = () => {
  const { isOpen: open, setIsOpen, modalType } = useModal()

  const handleClick = (): void => {
    setIsOpen(false)
  }

  const Component = MODAL_COMPONENTS[modalType]

  if (!Component) {
    return null
  }
  return (
    <DrawerFull
      open={open}
      onCancel={handleClick}
      icon={Bs0Circle}
      title={MODAL_TITLES[modalType]}
      onConfirm={() => {
        console.log('confirm')
      }}
      confirmLabel="Save"
    >
      <Component />
    </DrawerFull>
  )
}
