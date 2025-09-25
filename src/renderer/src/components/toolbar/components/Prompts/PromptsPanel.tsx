import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Select,
  createListCollection,
  Skeleton
} from '@chakra-ui/react'
import { Portal } from '@chakra-ui/react'
import { FiClipboard, FiCopy, FiCheck } from 'react-icons/fi'
import { useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { PanelLayout } from '../PanelLayout/PanelLayout'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { usePromptPreview } from '@renderer/hooks/usePromptPreview'
import { useStore } from '@renderer/hooks/useStore'
import { Prompt } from '@shared/types/store'

export function PromptsPanel(): JSX.Element {
  const { data: selected } = useSelectedText()
  const selectedText = selected?.text || ''

  const { data: prompts } = usePrompts()
  const {
    value: defaultPrompt,
    setValue: setDefaultPrompt,
    isLoading: isStoreLoading
  } = useStore<Prompt>({
    key: 'selectedPrompt'
  })

  // Ensure we have a valid selectedId that exists in the current prompts
  const selectedId = useMemo(() => {
    if (!prompts?.length) return null
    if (defaultPrompt && prompts.some((p) => p.ID === defaultPrompt.ID)) {
      return defaultPrompt.ID
    }
    // If defaultPrompt doesn't exist in current prompts, return first prompt's ID
    return prompts[0]?.ID || null
  }, [defaultPrompt, prompts])

  const selectedPromptValue = useMemo(
    () => prompts?.find((p) => p.ID === selectedId)?.value,
    [prompts, selectedId]
  )

  const { output, isStreaming, error, start, cancel, reset } = usePromptPreview({
    selectedText,
    promptValue: selectedPromptValue
  })

  // Sync selectedId back to store when it changes
  useEffect(() => {
    if (!prompts?.length || isStoreLoading || !selectedId) return

    const selectedPrompt = prompts.find((p) => p.ID === selectedId)
    if (selectedPrompt && (!defaultPrompt || defaultPrompt.ID !== selectedId)) {
      setDefaultPrompt(selectedPrompt)
    }
  }, [selectedId, prompts, defaultPrompt, setDefaultPrompt, isStoreLoading])

  useEffect(() => {
    if (!selectedText.trim()) return
    if (!selectedId || !selectedPromptValue) return
    // Start only when not already streaming
    if (!isStreaming) {
      reset()
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, selectedPromptValue, selectedText])

  return (
    <PanelLayout title="Prompts">
      <VStack align="stretch" gap={3}>
        <Box>
          <Text fontSize="xs" color="gray.300" mb={1}>
            Choose a prompt
          </Text>
          <Select.Root
            key={`select-${selectedId}`}
            variant="outline"
            size="sm"
            collection={createListCollection({
              items: (prompts || []).map((p) => ({ id: p.ID, label: p.label, value: p.ID }))
            })}
            value={selectedId ? [selectedId] : []}
            onValueChange={(details) => {
              const v = (details.value && details.value[0]) || null
              if (v !== selectedId) {
                if (isStreaming) cancel()
                const selectedPrompt = prompts?.find((p) => p.ID === v)
                if (selectedPrompt) {
                  setDefaultPrompt(selectedPrompt)
                }
              }
            }}
            disabled={!prompts?.length}
          >
            <Select.HiddenSelect />
            <Select.Control fontSize="xs">
              <Select.Trigger px={3} py={1.5} borderRadius={6} justifyContent="space-between">
                <Select.ValueText
                  placeholder={prompts?.length ? 'Select a prompt' : 'No prompts available'}
                />
              </Select.Trigger>
              <Select.IndicatorGroup ml={2} pr={1}>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content fontSize="xs" maxH="240px" overflowY="auto">
                  {prompts?.map((p) => {
                    const item = { id: p.ID, label: p.label, value: p.ID }
                    return (
                      <Select.Item key={p.ID} item={item} title={p.value}>
                        <Select.ItemText>{p.label}</Select.ItemText>
                        <Select.ItemIndicator ml="auto">
                          <FiCheck size={12} aria-hidden />
                        </Select.ItemIndicator>
                      </Select.Item>
                    )
                  })}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>

        <HStack>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => window.api.pasteText(output)}
            disabled={!output.trim()}
            display="inline-flex"
            gap={1}
          >
            <FiClipboard size={12} aria-hidden />
            Paste
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={async () => {
              if (!output.trim()) return
              await navigator.clipboard.writeText(output)
            }}
            disabled={!output.trim()}
            display="inline-flex"
            gap={1}
          >
            <FiCopy size={12} aria-hidden />
            Copy
          </Button>
        </HStack>

        <Box
          fontSize="md"
          style={{ lineHeight: '1.6', maxWidth: '100%', wordBreak: 'break-word' }}
          px={1}
        >
          {error ? (
            <Text color="red.300" fontSize="xs">
              {error}
            </Text>
          ) : output ? (
            <ReactMarkdown>{output}</ReactMarkdown>
          ) : (
            <VStack align="stretch" gap={2} py={1}>
              <Skeleton height="10px" bg="gray.600" opacity={0.4} />
              <Skeleton height="10px" bg="gray.600" opacity={0.35} />
              <Skeleton height="10px" width="70%" bg="gray.600" opacity={0.3} />
            </VStack>
          )}
        </Box>
      </VStack>
    </PanelLayout>
  )
}
