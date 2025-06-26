import { Box, Tabs, TabsContentProps } from '@chakra-ui/react'

export const TabContents = ({ children, ...rest }: TabsContentProps & { label?: string }) => {
  return (
    <Tabs.Content p={0} {...rest}>
      <Box height={'calc(100vh - 48px)'} overflow={'auto'} p="2">
        {children}
      </Box>
    </Tabs.Content>
  )
}
