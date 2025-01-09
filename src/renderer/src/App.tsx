import { RadioList } from './components/RadioList'
import { Container, IconButton, Tabs } from '@chakra-ui/react'
import { Header } from './components/Header'
import { GoGear, GoPencil, GoTools } from 'react-icons/go'
import { BsClipboard } from 'react-icons/bs'
import { useStore } from './hooks/useStore'
import { OptionType } from 'src/shared/types/store'

function App() {
  const { value: options, isLoading } = useStore<OptionType[]>({
    key: 'prompts'
  })
  const { setValue: setSelectedPrompt } = useStore({ key: 'selectedPrompt' })

  const handleChange = (value: string) => {
    setSelectedPrompt(value)
  }

  return (
    <Container>
      <Header />
      <IconButton
        variant="subtle"
        rounded="full"
        size={'sm'}
        css={{
          position: 'absolute',
          top: '50px',
          right: '15px',
          zIndex: 12
        }}
        aria-label="Settings"
      >
        <BsClipboard />
      </IconButton>
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
          {isLoading ? 'Loading...' : <RadioList options={options} onChange={handleChange} />}
        </Tabs.Content>
        <Tabs.Content value="settings">Manage your settings</Tabs.Content>
        <Tabs.Content value="about">About the app</Tabs.Content>
      </Tabs.Root>
    </Container>
  )
}

export default App
