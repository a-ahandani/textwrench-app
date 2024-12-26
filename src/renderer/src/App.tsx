import { useState } from 'react'
import Versions from './components/Versions'

function App() {
  const [clipboardText, setClipboardText] = useState<string>('')

  window.api.onClipboardUpdated((text) => {
    setClipboardText(text)
  })

  return (
    <>
      <p>Clipboard text: {clipboardText}</p>
      <Versions></Versions>
    </>
  )
}

export default App
