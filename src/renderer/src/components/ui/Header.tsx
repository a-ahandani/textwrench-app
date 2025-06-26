import { Box, Heading } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { GoX } from 'react-icons/go'
import { SearchInput } from './SearchInput'

export const Header = () => {
  const platform = window?.electron?.process?.platform
  const isMac = platform === 'darwin'
  return (
    <Box
      display={'flex'}
      flexDirection={isMac ? 'row-reverse' : 'row'}
      alignItems={'center'}
      height={12}
    >
      <Heading
        width={'100%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent="flex-start"
        p={3}
        height={'100%'}
        flex={1}
        size={'sm'}
        fontWeight="bold"
        textAlign={isMac ? 'right' : 'left'}
      >
        <Box display={'flex'} flex={1} justifyContent={'flex-start'} alignItems={'center'}>
          <SearchInput />
        </Box>
        <Box
          flex={1}
          height={'100%'}
          css={{
            WebkitAppRegion: 'drag'
          }}
        ></Box>
      </Heading>

      {!isMac && (
        <IconButton
          mx={0}
          height={'36px'}
          width={'36px'}
          onClick={() => {
            window.api.closeWindow()
          }}
          borderRadius="0"
          size="xs"
          variant="plain"
          _hover={{
            bg: 'red.600',
            color: 'white'
          }}
        >
          <GoX />
        </IconButton>
      )}
    </Box>
  )
}
