'use client'

import { ChakraProvider as Chakra, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './ColorModeProvider'

export const ChakraProvider = (props: ColorModeProviderProps) => {
  return (
    <Chakra value={defaultSystem}>
      <ColorModeProvider {...props} />
    </Chakra>
  )
}
