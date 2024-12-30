import { Box, Heading, Icon } from '@chakra-ui/react'
import { GoTools } from 'react-icons/go'

export const Header = () => (
  <Box
    css={{
      '-webkit-app-region': 'drag'
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
    <Icon fontSize="xl" ml={2}>
      <GoTools />
    </Icon>
  </Box>
)
