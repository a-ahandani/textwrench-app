import { Box } from '@chakra-ui/react'
import { Auth } from './components/Auth'
import { Hotkeys } from './components/Hotkeys'

export const Settings = () => {
  return (
    <Box>
      <Auth />

      <Hotkeys />
    </Box>
  )
}
