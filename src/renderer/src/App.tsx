import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/pages/clipboard/Clipboard'
import { Header } from './components/ui/Header'
import { TabContents } from './components/ui/TabContents'
import { useAuth } from './components/providers/AuthProvider'
import { useEffect } from 'react'
import { UpdateAlert } from './components/ui/UpdateAlert'
import { Modal } from './components/pages/explain/Modal'
import { useRoute } from './components/providers/RouteProvider'
import { PromptForm } from './components/pages/prompts/components/PromptForm'

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
      <Header />
      <UpdateAlert />
      <Container maxWidth="full" p="0" pr="0">
        <Clipboard />
        <Modal />
        <Tabs.Root
          orientation="horizontal"
          size="sm"
          value={activeRoute}
          variant="subtle"
          borderRadius={0}
        >
          <Tabs.List borderRadius={0} bg="#da9619" width={'100%'} display={'flex'}>
            {visibleRoutes.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                onClick={() => setCurrentRoute(tab.value)}
                fontSize={'xs'}
                fontWeight="medium"
                display={'flex'}
                alignItems="center"
                justifyContent="center"
                borderRadius={0}
                color={activeRoute === tab.value ? 'auto' : 'black'}
              >
                {tab.icon} {tab.label}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
          {visibleRoutes.map((tab) => (
            <TabContents key={tab.value} value={tab.value} flex={1}>
              {tab.content}
            </TabContents>
          ))}
        </Tabs.Root>
      </Container>
      <PromptForm />
    </>
  )
}

export default App
