import { useEffect, useState } from 'react'
import { RadioList } from './components/RadioList'
import { Container, Tabs } from '@chakra-ui/react'
import { Header } from './components/Header'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'

function App() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  const { getStoreValue, setStoreValue } = window.api

  useEffect(() => {
    const loadPromptOptions = async () => {
      const promptOptions = await getStoreValue('prompts')
      setOptions(promptOptions)
    }
    loadPromptOptions()
  }, [])

  const handleChange = (value: string) => {
    setStoreValue('selectedPrompt', value)
  }

  return (
    <Container>
      <Header />
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
          <RadioList options={options} onChange={handleChange} />
        </Tabs.Content>
        <Tabs.Content value="settings">Manage your settings</Tabs.Content>
        <Tabs.Content value="about">About the app</Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}

export default App
