import { Box, Heading } from '@chakra-ui/react'
import { SearchInput } from './SearchInput'
import { GoTools } from 'react-icons/go'

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
        textAlign={'right'}
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
          display={'flex'}
          alignItems={'center'}
          justifyContent={'flex-end'}
          fontWeight="bold"
          fontSize={'sm'}
        >
          Textwrench
          <GoTools style={{ marginLeft: '8px' }} />
        </Box>
      </Heading>
    </Box>
  )
}
