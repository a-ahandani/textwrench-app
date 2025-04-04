import { Prompts } from './components/pages/prompts/Prompts'
import { Settings } from './components/pages/settings/Settings'
import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/pages/clipboard/Clipboard'
import { Header } from './components/ui/Header'
import { TabContents } from './components/ui/TabContents'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'
import { useAuth } from './components/providers/AuthProvider'
import { useEffect, useState } from 'react'
import { About } from './components/pages/about/About'
import { UpdateAlert } from './components/ui/UpdateAlert'
import { Modal } from './components/pages/explain/Modal'

function App(): JSX.Element {
  const { isLoggedIn } = useAuth()

  const tabs = [
    { value: 'prompts', icon: <GoPencil />, content: <Prompts />, isProtected: true },
    { value: 'settings', icon: <GoGear />, content: <Settings />, isProtected: false },
    { value: 'about', icon: <GoTools />, content: <About />, isProtected: false }
  ]
  const filteredTabs = tabs.filter((tab) => !tab.isProtected || isLoggedIn)
  const defaultTab = isLoggedIn ? 'prompts' : 'settings'
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    if (!isLoggedIn) {
      setActiveTab('settings')
    }
  }, [isLoggedIn])

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
          value={activeTab}
          variant="line"
          borderRadius={0}
          unmountOnExit
        >
          <Tabs.List borderRadius={0} pl={'2px'} pr={0} bg="bg.muted">
            {filteredTabs.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.icon}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator />
          </Tabs.List>
          {filteredTabs.map((tab) => (
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
