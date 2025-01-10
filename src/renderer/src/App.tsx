import { PromptList } from './components/PromptList'
import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/Clipboard'
import { Header } from './components/Header'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'

function App() {
  return (
    <Container>
      <Header />
      <Clipboard />
      <Tabs.Root defaultValue="prompts" variant="plain">
        <Tabs.List bg="bg.muted" rounded="l3" p="1">
          <Tabs.Trigger value="prompts">
            <GoPencil />
            Prompts
          </Tabs.Trigger>
          <Tabs.Trigger value="settings">
            <GoGear />
            Settings
          </Tabs.Trigger>
          <Tabs.Trigger value="about">
            <GoTools />
            About
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value="prompts">
          <PromptList />
        </Tabs.Content>
        <Tabs.Content value="settings">Manage your settings</Tabs.Content>
        <Tabs.Content value="about">About the app</Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}

export default App
