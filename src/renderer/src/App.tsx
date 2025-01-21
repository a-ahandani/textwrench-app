import { PromptList } from './components/pages/prompts/PromptList'
import { Settings } from './components/pages/settings/Settings'
import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/pages/clipboard/Clipboard'
import { Header } from './components/ui/Header'
import { TabContents } from './components/ui/TabContents'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'
import { useAuth } from './components/providers/AuthProvider'

function App() {
  const { isLoggedIn } = useAuth()

  const tabs = [
    { value: 'prompts', icon: <GoPencil />, content: <PromptList />, isProtected: true },
    { value: 'settings', icon: <GoGear />, content: <Settings />, isProtected: false },
    { value: 'about', icon: <GoTools />, content: 'About the app', isProtected: false }
  ]

  const filteredTabs = tabs.filter((tab) => !tab.isProtected || isLoggedIn)
  const defaultTab = isLoggedIn ? 'prompts' : 'settings'

  return (
    <Container p="2">
      <Header />
      <Clipboard />
      <Tabs.Root orientation="vertical" size="md" defaultValue={defaultTab} variant="plain">
        <Tabs.List bg="bg.muted" rounded="l3" p="1" m="0" border={'none'}>
          {filteredTabs.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.icon}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        {filteredTabs.map((tab) => (
          <TabContents key={tab.value} value={tab.value}>
            {tab.content}
          </TabContents>
        ))}
      </Tabs.Root>
    </Container>
  )
}

export default App
