import { Box, Heading } from '@chakra-ui/react'
import { GoTools } from 'react-icons/go'
import { IconButton } from '@chakra-ui/react'
import { GoX } from 'react-icons/go'

export const Header = () => {
  const platform = window?.electron?.process?.platform
  const isMac = platform === 'darwin'
  return (
    <Box
      display={'flex'}
      flexDirection={isMac ? 'row-reverse' : 'row'}
      alignItems={'center'}
      height={9}
    >
      <Box
        mx={2}
        css={{
          WebkitAppRegion: 'drag'
        }}
      >
        <GoTools fontSize="xl" />
      </Box>
      <Heading
        css={{
          WebkitAppRegion: 'drag'
        }}
        flex={1}
        lineHeight="tall"
        size={'xs'}
        fontWeight={'bold'}
        textAlign={isMac ? 'right' : 'left'}
      >
        TEXTWRENCH
      </Heading>

      {!isMac && (
        <IconButton
          mx={2}
          onClick={() => {
            window.api.closeWindow()
          }}
          borderRadius={0}
          size="xs"
          colorPalette="red"
        >
          <GoX />
        </IconButton>
      )}
    </Box>
  )
}
