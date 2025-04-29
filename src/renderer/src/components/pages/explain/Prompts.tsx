import { Box, Button, IconButton, Kbd, Portal, SkeletonText, Tabs, Text } from '@chakra-ui/react'
import { useModal } from '@renderer/components/providers/ModalProvider'
import { TabContents } from '@renderer/components/ui/TabContents'
import { useEventSubscription } from '@renderer/hooks/useEventSubscription'
import { useProcessText } from '@renderer/hooks/useProcessText'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { ModalTypes } from '@shared/constants'
import { BsArrowReturnLeft } from 'react-icons/bs'

import { FC, RefObject, useState, useCallback } from 'react'
import { BsClipboard } from 'react-icons/bs'
import { useHotkeys } from 'react-hotkeys-hook'
import { Tooltip } from '@renderer/components/ui/Tooltip'

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

  useHotkeys(
    'enter',
    (e) => {
      e.preventDefault()
      handlePaste()
    },
    {
      keyup: true
    }
  )

  const handlePaste = async (): Promise<void> => {
    if (!processedText) return
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
            <Tooltip content="Press Enter to insert">
              <Button
                aria-label={'Insert'}
                size="xs"
                mx={2}
                variant="solid"
                colorPalette="green"
                disabled={!processedText}
                onClick={handlePaste}
              >
                Enter
                <BsArrowReturnLeft />
              </Button>
            </Tooltip>
            <Tooltip content="Copy processed text to clipboard">
              <IconButton
                colorPalette="orange"
                variant="solid"
                size={'xs'}
                aria-label="Settings"
                onClick={handleCopy}
              >
                <BsClipboard />
              </IconButton>
            </Tooltip>
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

          <Box bottom={0} position="fixed" left={0} right={0} p={4}>
            <Text fontSize={'x-small'} color="gray.500" lineClamp="1">
              <Kbd>↑</Kbd>
              <Kbd mx={1}>↓</Kbd>
              Use arrow keys to navigate
            </Text>
          </Box>
        </Tabs.List>

        <Box width={'full'} pr={4} ml={3} py={1}>
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
              {isFetching ? <SkeletonText noOfLines={3} gap="4" /> : processedText}
            </TabContents>
          ))}
        </Box>
      </Tabs.Root>
    </Box>
  )
}
