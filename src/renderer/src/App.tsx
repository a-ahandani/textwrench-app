import { useEffect, useState } from 'react'
import { RadioList } from './components/RadioList'
import { Box, Container, Heading, Icon } from '@chakra-ui/react'
import { GoTools } from 'react-icons/go'

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
      <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} mb={2} p={2}>
        <Heading lineHeight="tall" size={'xs'} fontWeight={'bold'}>
          TEXTWRENCH
        </Heading>
        <Icon fontSize="xl" ml={2}>
          <GoTools />
        </Icon>
      </Box>
      <RadioList options={options} onChange={handleChange} />
    </Container>
  )
}

export default App
