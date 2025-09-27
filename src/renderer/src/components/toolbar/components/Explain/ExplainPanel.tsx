import { Box, HStack, Text, VStack, Button, Textarea } from '@chakra-ui/react'
// (cursor blink animation moved into global Markdown component if needed)
// Unified markdown renderer
import Markdown from '@renderer/components/ui/Markdown'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { PanelLayout } from '../PanelLayout/PanelLayout'
import { useExplainText } from '@renderer/hooks/useExplainText'
import { useCallback, useMemo, useState } from 'react'
import { IoSend } from 'react-icons/io5'

// Removed local cursorBlink; Markdown component handles cursor styling.

export function ExplainPanel(): JSX.Element {
  const { data: selected } = useSelectedText()
  const textToExplain = selected?.text || ''

  const { output, isStreaming, error, start, reset } = useExplainText()

  // Chat-like feedback input state
  const [feedback, setFeedback] = useState('')

  // Build a contextual follow-up to send using the existing streaming API
  const makeFollowupPayload = useCallback(
    (fb: string) => {
      const original = textToExplain.trim()
      const prior = (output || '').trim()
      const fbText = fb.trim()
      const header = prior
        ? 'The assistant previously generated an explanation. Consider it as context.'
        : 'No explanation was generated yet; please answer based on the original text.'
      return [
        header,
        '',
        original ? `Original text:\n${original}` : undefined,
        prior ? `Assistant explanation so far:\n${prior}` : undefined,
        `User follow-up / feedback:\n${fbText}`,
        '',
        'Please respond to the follow-up: refine, clarify, or answer the question. Use concise markdown.'
      ]
        .filter(Boolean)
        .join('\n')
    },
    [output, textToExplain]
  )

  const canSend = useMemo(
    () => !!textToExplain.trim() && !!feedback.trim() && !isStreaming,
    [feedback, isStreaming, textToExplain]
  )

  const handleSend = useCallback(() => {
    if (!canSend) return
    const payload = makeFollowupPayload(feedback)
    // Start a new streamed response with contextualized follow-up
    reset()
    start(payload)
    setFeedback('')
  }, [canSend, feedback, makeFollowupPayload, reset, start])

  const footer = textToExplain ? (
    <VStack gap={2} align="stretch">
      <HStack align="start">
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          size="sm"
          placeholder={
            output
              ? 'Ask a follow-up or give feedback (Shift+Enter for newline)'
              : 'Ask a question about the selected text (Shift+Enter for newline)'
          }
          resize="vertical"
          maxH="160px"
          minH="30px"
          disabled={!textToExplain || isStreaming}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button
          aria-label="Send feedback"
          size="sm"
          disabled={!canSend}
          onClick={handleSend}
          variant="subtle"
        >
          <IoSend style={{ marginRight: 6 }} /> Send
        </Button>
      </HStack>
      <Text fontSize="xs" color="gray.400">
        Press Enter to send, Shift+Enter for a new line.
      </Text>
    </VStack>
  ) : undefined

  return (
    <PanelLayout title="Explain" footer={footer}>
      <Box>
        {!textToExplain && (
          <Text fontSize="xs" color="gray.400">
            Select some text first to generate an explanation.
          </Text>
        )}

        {error && (
          <VStack align="stretch" gap={2} fontSize="xs" color="red.300">
            <Text>Failed to generate explanation.</Text>
            <Text>{error}</Text>
            <Button
              size="xs"
              onClick={() => {
                reset()
                start()
              }}
            >
              Retry
            </Button>
          </VStack>
        )}
        {(output || isStreaming) && (
          <Markdown px={2} withCursor isStreaming={isStreaming}>
            {output}
          </Markdown>
        )}
        {textToExplain && !isStreaming && !error && !output && (
          <HStack mt={2}>
            <Button size="xs" variant="subtle" onClick={() => start()}>
              Explain Text
            </Button>
          </HStack>
        )}
      </Box>
    </PanelLayout>
  )
}
