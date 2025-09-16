import { Button } from '@chakra-ui/react'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { useProcessText } from '@renderer/hooks/useProcessText'

export const FixIt = (props): JSX.Element => {
  const { data } = useSelectedText()

  const text = data?.text || ''
  const { mutate: processText, isPending } = useProcessText({
    onSuccess: (text) => {
      window.api.pasteText({ text: text || '', appPID: data?.window?.appPID || 0 })
    },
    onError: (error) => {
      console.error('Error processing text:', error)
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
      Rewrite with AI
    </Button>
  )
}
