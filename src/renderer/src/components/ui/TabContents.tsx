import { Tabs, TabsContentProps } from '@chakra-ui/react'

export const TabContents = ({ children, ...rest }: TabsContentProps) => {
  return (
    <Tabs.Content p={0} {...rest}>
      {children}
    </Tabs.Content>
  )
}
