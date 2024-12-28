import { useEffect, useState } from 'react'
import { RadioList } from './components/RadioList'

function App() {
  const [clipboardText, setClipboardText] = useState<string>('')
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])

  const { onClipboardUpdated, getPromptOptions } = window.api
  onClipboardUpdated((text) => {
    setClipboardText(text)
  })

  useEffect(() => {
    const loadPromptOptions = async () => {
      const promptOptions = await getPromptOptions()
      setOptions(promptOptions)
    }
    loadPromptOptions()
  }, [])

  const handleChange = (value: string) => {
    console.log('Selected value:', value)
  }

  return (
    <div>
      <p>Clipboard text: {clipboardText}</p>
      <RadioList options={options} onChange={handleChange} />
    </div>
  )
}

export default App
