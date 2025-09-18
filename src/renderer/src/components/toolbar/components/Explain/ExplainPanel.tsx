import { Box, HStack, Text, VStack, Button, Textarea } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import ReactMarkdown from 'react-markdown'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { PanelLayout } from '../PanelLayout/PanelLayout'
import { useExplainText } from '@renderer/hooks/useExplainText'
import { useCallback, useMemo, useState } from 'react'
import { IoSend } from 'react-icons/io5'

const cursorBlink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`

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
          <Box
            fontSize="md"
            style={{
              lineHeight: '1.6',
              maxWidth: '100%',
              wordBreak: 'break-word',
              letterSpacing: '0.01em'
            }}
            px={2}
            aria-live="polite"
            // Blinking cursor at end while streaming
            _after={
              isStreaming
                ? {
                    content: '""',
                    display: 'inline-block',
                    width: '6px',
                    height: '1em',
                    ml: '2px',
                    bg: 'gray.300',
                    animation: `${cursorBlink} 1s steps(2, start) infinite`,
                    borderRadius: '1px',
                    verticalAlign: 'text-bottom'
                  }
                : undefined
            }
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <Text as="p" m={0} mb={3} fontSize="inherit" lineHeight="inherit">
                    {children}
                  </Text>
                ),
                ul: ({ children }) => (
                  <Box
                    as="ul"
                    style={{
                      paddingInlineStart: 22,
                      margin: '8px 0 14px',
                      listStyleType: 'disc'
                    }}
                  >
                    {children}
                  </Box>
                ),
                ol: ({ children }) => (
                  <Box
                    as="ol"
                    style={{
                      paddingInlineStart: 24,
                      margin: '8px 0 14px',
                      listStyleType: 'decimal'
                    }}
                  >
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Box as="li" m={0} mb={2}>
                    <Text as="span" fontSize="inherit" lineHeight="inherit">
                      {children}
                    </Text>
                  </Box>
                ),
                code: ({ children }) => {
                  const text = String(children)
                  const isBlock = text.includes('\n')
                  return (
                    <Box
                      as={isBlock ? 'pre' : 'code'}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: isBlock ? '12px 14px' : '3px 6px',
                        borderRadius: 8,
                        overflowX: isBlock ? 'auto' : 'initial',
                        display: isBlock ? 'block' : 'inline',
                        fontSize: '0.92em',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                      }}
                    >
                      {children}
                    </Box>
                  )
                },
                h1: ({ children }) => (
                  <Text
                    as="h1"
                    fontSize="1.25rem"
                    fontWeight="semibold"
                    mt={2}
                    mb={3}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                h2: ({ children }) => (
                  <Text
                    as="h2"
                    fontSize="1.1rem"
                    fontWeight="semibold"
                    mt={2}
                    mb={2}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                h3: ({ children }) => (
                  <Text
                    as="h3"
                    fontSize="1.0rem"
                    fontWeight="semibold"
                    mt={2}
                    mb={2}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                blockquote: ({ children }) => (
                  <Box
                    as="blockquote"
                    style={{
                      borderLeft: '3px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.04)',
                      margin: '10px 0',
                      paddingLeft: 12,
                      color: 'var(--chakra-colors-gray-300)'
                    }}
                  >
                    {children}
                  </Box>
                )
              }}
            >
              {output}
            </ReactMarkdown>
          </Box>
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
