import { Box, Heading } from '@chakra-ui/react'
import { GoTools } from 'react-icons/go'

export const Header = () => (
  <Box
    css={{
      WebkitAppRegion: 'drag'
    }}
    display={'flex'}
    justifyContent={'flex-end'}
    alignItems={'center'}
    mb={2}
    p={2}
  >
    <Heading lineHeight="tall" size={'xs'} fontWeight={'bold'}>
      TEXTWRENCH
    </Heading>
    <Box ml={2}>
      <GoTools fontSize="xl" />
    </Box>
  </Box>
)
