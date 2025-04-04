'use client'

import { ChakraProvider as Chakra, createSystem, defaultConfig } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './ColorModeProvider'
import '@fontsource-variable/noto-sans-arabic'

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Noto Sans Arabic Variable' },
        body: { value: 'Noto Sans Arabic Variable' }
      }
    }
  }
})

export const ChakraProvider = (props: ColorModeProviderProps) => {
  return (
    <Chakra value={system}>
      <ColorModeProvider {...props} />
    </Chakra>
  )
}
