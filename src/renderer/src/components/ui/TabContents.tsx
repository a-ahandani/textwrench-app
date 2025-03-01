import { Box, Tabs, TabsContentProps } from '@chakra-ui/react'

export const TabContents = ({ children, ...rest }: TabsContentProps) => {
  return (
    <Tabs.Content p={0} {...rest}>
      <Box height={'calc(100vh - 38px)'} overflow={'auto'} p="2">
        {children}
      </Box>
    </Tabs.Content>
  )
}
