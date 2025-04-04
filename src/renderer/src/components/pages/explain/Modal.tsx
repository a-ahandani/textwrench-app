import { Bs0Circle } from 'react-icons/bs'
import { DrawerFull } from '../../ui/Drawer'
import { useModal } from '@renderer/components/providers/ModalProvider'

import { FC, useRef } from 'react'
import { Explain } from './Explain'
import { Prompts } from './Prompts'
import { MODAL_TITLES, ModalTypes } from '@shared/constants'

const MODAL_COMPONENTS = {
  [ModalTypes.EXPLAIN]: Explain,
  [ModalTypes.PROMPT]: Prompts
}

export const Modal: FC = () => {
  const { isOpen: open, setIsOpen, modalType } = useModal()

  const handleClick = (): void => {
    setIsOpen(false)
  }

  const Component = MODAL_COMPONENTS[modalType]

  const ACTIONS_REF = {
    [ModalTypes.EXPLAIN]: useRef(),
    [ModalTypes.PROMPT]: useRef()
  }

  if (!Component) {
    return null
  }
  return (
    <DrawerFull
      open={open}
      onCancel={handleClick}
      icon={Bs0Circle}
      title={MODAL_TITLES[modalType]}
      actionRef={ACTIONS_REF[modalType]}
    >
      <Component actionRef={ACTIONS_REF[modalType]} />
    </DrawerFull>
  )
}
