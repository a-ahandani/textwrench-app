import { Box, Button, IconButton, Portal, SkeletonText, Tabs, Text } from '@chakra-ui/react'
import { useModal } from '@renderer/components/providers/ModalProvider'
import { TabContents } from '@renderer/components/ui/TabContents'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { useProcessText } from '@renderer/hooks/useProcessText'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { ModalTypes } from '@shared/constants'
import { GoThumbsup } from 'react-icons/go'

import { FC, RefObject, useState, useCallback } from 'react'
import { BsClipboard } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'

interface PromptsProps {
  actionRef: RefObject<HTMLElement | null>
}

export const Prompts: FC<PromptsProps> = ({ actionRef }) => {
  const { data: prompts } = usePrompts()
  const { content: selectedText } = useModal()

  const [selectedPrompt, setSelectedPrompt] = useState<string>(prompts?.[0]?.ID || '')

  const selectedPromptObj = prompts?.find((item) => item.ID === selectedPrompt)
  const { data: processedText, isFetching } = useProcessText({
    payload: {
      selectedText,
      selectedPrompt: selectedPromptObj || { value: '' }
    }
  })

  const changePrompt = useCallback(
    (direction: 'next' | 'prev') => {
      if (!prompts?.length) return

      const currentIndex = prompts.findIndex((item) => item.ID === selectedPrompt)

      if (currentIndex === -1) {
        setSelectedPrompt(prompts[0].ID)
        return
      }

      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % prompts.length
          : (currentIndex - 1 + prompts.length) % prompts.length

      setSelectedPrompt(prompts[nextIndex].ID)
    },
    [prompts, selectedPrompt]
  )

  useEventSubscription<{ data: string; type: string }>({
    eventName: 'onOpenModal',
    callback: ({ type }) => {
      if (type === ModalTypes.PROMPT) {
        changePrompt('next')
      }
    },
    dependencies: [changePrompt]
  })

  useHotkeys('arrowdown', (e) => {
    e.preventDefault()
    changePrompt('next')
  })

  useHotkeys('arrowup', (e) => {
    e.preventDefault()
    changePrompt('prev')
  })

  useHotkeys('enter', (e) => {
    e.preventDefault()
    handlePaste()
  })

  const handlePaste = async (): Promise<void> => {
    window.api.hidePaste(processedText)
  }

  const handleCopy = async (): Promise<void> => {
    if (!processedText) return
    await navigator.clipboard.writeText(processedText)
  }

  return (
    <Box>
      {actionRef && (
        <Portal container={actionRef}>
          <div>
            <Button
              aria-label={'Insert'}
              size="xs"
              mx={1}
              variant="solid"
              colorPalette="green"
              onClick={handlePaste}
            >
              <GoThumbsup />
              Insert
            </Button>
            <IconButton
              colorPalette="orange"
              variant="solid"
              size={'xs'}
              aria-label="Settings"
              onClick={handleCopy}
            >
              <BsClipboard />
            </IconButton>
          </div>
        </Portal>
      )}

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

        <Box width={'full'} pr={4} ml={3} py={1}>
          {isFetching && <SkeletonText noOfLines={3} gap="4" />}
          {prompts?.map((item) => (
            <TabContents
              key={item.ID}
              value={item.ID}
              flex={1}
              fontSize="md"
              dir="auto"
              lineHeight="tall"
              whiteSpace="pre-line"
            >
              {processedText}
            </TabContents>
          ))}
        </Box>
      </Tabs.Root>
    </Box>
  )
}
