import { useEffect, useState } from 'react'
import { RadioList } from './components/RadioList'

function App() {
  const [clipboardText, setClipboardText] = useState<string>('')
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  const { onClipboardUpdated, getStoreValue, setStoreValue } = window.api
  onClipboardUpdated((text) => {
    setClipboardText(text)
  })

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
    <div>
      <p>Clipboard text: {clipboardText}</p>
      <RadioList options={options} onChange={handleChange} />
    </div>
  )
}

export default App
