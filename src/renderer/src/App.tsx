import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/pages/clipboard/Clipboard'
import { Header } from './components/ui/Header'
import { TabContents } from './components/ui/TabContents'
import { useAuth } from './components/providers/AuthProvider'
import { useEffect } from 'react'
import { UpdateAlert } from './components/ui/UpdateAlert'
import { Modal } from './components/pages/explain/Modal'
import { useRoute } from './components/providers/RouteProvider'

function App(): JSX.Element {
  const { isLoggedIn } = useAuth()
  const { visibleRoutes, activeRoute, setCurrentRoute } = useRoute()

  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentRoute('settings')
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
          orientation="vertical"
          size="lg"
          value={activeRoute}
          variant="line"
          borderRadius={0}
          unmountOnExit
        >
          <Tabs.List borderRadius={0} pl={'2px'} pr={0} bg="bg.muted">
            {visibleRoutes.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                onClick={() => setCurrentRoute(tab.value)}
              >
                {tab.icon}
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
    </>
  )
}

export default App
