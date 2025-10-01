import { Button } from '@chakra-ui/react'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { useProcessText } from '@renderer/hooks/useProcessText'
import { error } from 'electron-log'
import { GiElectric } from 'react-icons/gi'

export const FixIt = (props): JSX.Element => {
  const { data } = useSelectedText()

  const text = data?.text || ''
  const { mutate: processText, isPending } = useProcessText({
    onSuccess: (text) => {
      // If usage limit was reached, backend returns empty/undefined => skip paste
      if (!text || (typeof text === 'string' && text.trim().length === 0)) {
        return
      }
      window.api.pasteText({ text, appPID: data?.window?.appPID || 0 })
    },
    onError: (er) => {
      error('Error processing text:', er)
    }
  })

  return (
    <Button
      {...props}
      loading={isPending}
      onClick={() => {
        processText({
          selectedText: text
        })
      }}
    >
      <GiElectric />
      Rewrite with AI
    </Button>
  )
}
