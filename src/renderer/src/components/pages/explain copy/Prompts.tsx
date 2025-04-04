import { Box, HStack, IconButton, Tabs, Text } from '@chakra-ui/react'
import { useModal } from '@renderer/components/providers/ModalProvider'
import { TabContents } from '@renderer/components/ui/TabContents'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { useProcessText } from '@renderer/hooks/useProcessText'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { ModalTypes } from '@shared/constants'

import { FC, useState } from 'react'
import { BsClipboard } from 'react-icons/bs'

export const Prompts: FC = () => {
  const { data: prompts } = usePrompts()

  const { content: selectedText } = useModal()
  const [selectedPrompt, setSelectedPrompt] = useState<string>(prompts?.[0]?.ID || '')

  const { data: processedText } = useProcessText({
    payload: {
      selectedText,
      selectedPrompt: prompts?.find((item) => item.ID == selectedPrompt) || { value: '' }
    }
  })

  const handlePaste = async (): Promise<void> => {
    window.api.hidePaste(processedText)
  }

  useEventSubscription<{ data: string; type: string }>({
    eventName: 'onOpenModal',
    callback: ({ type }) => {
      if (!prompts) return
      const selectedItemIndex = prompts?.findIndex((item) => item.ID == selectedPrompt)
      if (type === ModalTypes.PROMPT) {
        if (
          selectedItemIndex !== undefined &&
          selectedItemIndex !== -1 &&
          selectedItemIndex + 1 < prompts.length
        ) {
          setSelectedPrompt(prompts?.[selectedItemIndex + 1]?.ID)
          return
        }
        setSelectedPrompt(prompts?.[0]?.ID)
      }
    },
    dependencies: [prompts, selectedPrompt]
  })

  return (
    <Box>
      <Tabs.Root
        orientation="vertical"
        size="lg"
        value={selectedPrompt}
        variant="line"
        borderRadius={0}
        unmountOnExit
      >
        <Tabs.List borderRadius={0} pl={'2px'} pr={0} bg="bg.muted">
          {prompts?.map((item) => (
            <Tabs.Trigger
              width={200}
              key={item.ID}
              value={item.ID}
              onClick={() => setSelectedPrompt(item.ID)}
            >
              <Text fontSize={'sm'} lineClamp="1">
                {item.label}
              </Text>
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator />
        </Tabs.List>
        <Box width={'full'}>
          <HStack wrap="wrap" justifyContent={'end'} gap="1">
            <IconButton variant="subtle" size={'sm'} aria-label="Settings" onClick={handlePaste}>
              <BsClipboard />
            </IconButton>
            <IconButton variant="subtle" size={'sm'} aria-label="Settings" onClick={handlePaste}>
              <BsClipboard />
            </IconButton>
          </HStack>

          {prompts?.map((item) => (
            <TabContents key={item.ID} value={item.ID} flex={1}>
              {processedText}
            </TabContents>
          ))}
        </Box>
      </Tabs.Root>
    </Box>
  )
}
