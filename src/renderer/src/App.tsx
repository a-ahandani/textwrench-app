import { Box, Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/pages/clipboard/Clipboard'
import { TabContents } from './components/ui/TabContents'
import { useAuth } from './components/providers/AuthProvider'
import { useEffect } from 'react'
import { UpdateAlert } from './components/ui/UpdateAlert'
import { Modal } from './components/pages/explain/Modal'
import { useRoute } from './components/providers/RouteProvider'
import { PromptForm } from './components/pages/prompts/components/PromptForm'
import { Header } from './components/ui/Header'

function App(): JSX.Element {
  const { isLoggedIn } = useAuth()
  const { visibleRoutes, activeRoute, setCurrentRoute } = useRoute()

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentRoute('settings')
    } else {
      setCurrentRoute('prompts')
    }
  }, [isLoggedIn, setCurrentRoute])

  return (
    <>
      <UpdateAlert />
      <Container maxWidth="full" p="0">
        <Clipboard />
        <Modal />
        <Tabs.Root
          orientation="vertical"
          size="sm"
          value={activeRoute}
          variant="subtle"
          borderRadius={0}
        >
          <Tabs.List borderRadius={0} bg="#EDA220" display={'flex'}>
            <Box
              display={'flex'}
              css={{
                WebkitAppRegion: 'drag'
              }}
              height={'55px'}
              w={180}
            ></Box>
            {visibleRoutes.map((tab) => (
              <Tabs.Trigger
                zIndex={1000}
                key={tab.value}
                value={tab.value}
                onClick={() => {
                  setCurrentRoute(tab.value)
                }}
                fontSize={'xs'}
                fontWeight="medium"
                display={'flex'}
                alignItems="center"
                justifyContent="flex-start"
                borderRadius={0}
                height={10}
                backgroundColor={activeRoute === tab.value ? '#da9619' : 'transparent'}
                color="black"
              >
                {tab.icon} {tab.label}
              </Tabs.Trigger>
            ))}
            <Box
              display={'flex'}
              css={{
                WebkitAppRegion: 'drag'
              }}
              height={175}
              width={'100%'}
            ></Box>
          </Tabs.List>
          <Box display={'flex'} flexDirection="column" height={'100vh'} width={'100%'}>
            <Header />
            {visibleRoutes.map((tab) => (
              <TabContents key={tab.value} value={tab.value} label={tab.label} flex={1}>
                {tab.content}
              </TabContents>
            ))}
          </Box>
        </Tabs.Root>
      </Container>
      <PromptForm />
    </>
  )
}

export default App
