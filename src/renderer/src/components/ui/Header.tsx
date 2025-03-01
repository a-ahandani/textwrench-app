import { Box, Heading } from '@chakra-ui/react'
import { GoTools } from 'react-icons/go'
import { IconButton } from '@chakra-ui/react'
import { labels } from '@shared/constants'
import { GoX } from 'react-icons/go'

import { FC } from 'react'

export const Header: FC = () => {
  const platform = window?.electron?.process?.platform
  const isMac = platform === 'darwin'
  return (
    <Box
      display={'flex'}
      flexDirection={isMac ? 'row-reverse' : 'row'}
      alignItems={'center'}
      height={9}
      background="#EDA220"
      color="black"
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
        {labels.app}
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
