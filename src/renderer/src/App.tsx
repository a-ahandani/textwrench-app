import { PromptList } from './components/PromptList'
import { Settings } from './components/Settings'
import { Container, Tabs } from '@chakra-ui/react'
import { Clipboard } from './components/Clipboard'
import { Header } from './components/Header'
import { TabContents } from './components/ui/TabContents'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'

function App() {
  return (
    <Container p="2">
      <Header />
      <Clipboard />
      <Tabs.Root orientation="vertical" size="md" defaultValue="prompts" variant="plain">
        <Tabs.List bg="bg.muted" rounded="l3" p="1" m="0" border={'none'}>
          <Tabs.Trigger value="prompts">
            <GoPencil />
          </Tabs.Trigger>
          <Tabs.Trigger value="settings">
            <GoGear />
          </Tabs.Trigger>
          <Tabs.Trigger value="about">
            <GoTools />
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <TabContents value="prompts" width={'full'}>
          <PromptList />
        </TabContents>
        <TabContents value="settings">
          <Settings />
        </TabContents>
        <TabContents value="about">About the app</TabContents>
      </Tabs.Root>
    </Container>
  )
}

export default App
