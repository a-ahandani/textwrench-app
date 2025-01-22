import { Box, Tabs, TabsContentProps } from '@chakra-ui/react'

export const TabContents = ({ children, ...rest }: TabsContentProps) => {
  return (
    <Tabs.Content width={'full'} p={0} {...rest}>
      <Box height={'calc( 100vh - 53px )'} overflow={'auto'}>
        {children}
      </Box>
    </Tabs.Content>
  )
}
