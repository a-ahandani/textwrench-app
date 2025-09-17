import { Box, HStack, Text, VStack, Button, Spinner } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import React from 'react'
import { useExplainText } from '@renderer/hooks/useExplainText'
import { useSelectedText } from '@renderer/components/providers/SelectedTextProvider'
import { PanelLayout } from '../PanelLayout/PanelLayout'

export function ExplainPanel(): JSX.Element {
  const { data: selected } = useSelectedText()
  const textToExplain = selected?.text || ''
  const { mutate, data, isPending, isError, error, reset } = useExplainText()

  const runExplain = (): void => {
    if (!textToExplain.trim()) return
    mutate({ selectedText: textToExplain })
  }

  // Auto-trigger explanation on mount if text exists
  React.useEffect(() => {
    if (textToExplain.trim()) {
      runExplain()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textToExplain])

  return (
    <PanelLayout title="Explain">
      <Box>
        {!textToExplain && (
          <Text fontSize="xs" color="gray.400">
            Select some text first to generate an explanation.
          </Text>
        )}
        {textToExplain && isPending && (
          <HStack gap={2} fontSize="xs" color="gray.400">
            <Spinner size="xs" />
            <Text>Generating explanation...</Text>
          </HStack>
        )}
        {isError && (
          <VStack align="stretch" gap={2} fontSize="xs" color="red.300">
            <Text>Failed to generate explanation.</Text>
            <Text>{(error as Error)?.message || 'Unknown error'}</Text>
            <Button
              size="xs"
              onClick={() => {
                reset()
                runExplain()
              }}
            >
              Retry
            </Button>
          </VStack>
        )}
        {!isPending && !isError && data && (
          <Box
            fontSize="sm"
            style={{
              lineHeight: '1.35',
              maxWidth: '100%',
              wordBreak: 'break-word'
            }}
          >
            <ReactMarkdown
              components={{
                p: ({ children }) => (
                  <Text as="p" m={0} mb={2} fontSize="inherit" lineHeight="inherit">
                    {children}
                  </Text>
                ),
                ul: ({ children }) => (
                  <Box
                    as="ul"
                    style={{
                      paddingInlineStart: 18,
                      margin: '6px 0 10px',
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
                      paddingInlineStart: 20,
                      margin: '6px 0 10px',
                      listStyleType: 'decimal'
                    }}
                  >
                    {children}
                  </Box>
                ),
                li: ({ children }) => (
                  <Box as="li" m={0} mb={1}>
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
                        background: 'rgba(255,255,255,0.06)',
                        padding: isBlock ? '10px 12px' : '2px 6px',
                        borderRadius: 6,
                        overflowX: isBlock ? 'auto' : 'initial',
                        display: isBlock ? 'block' : 'inline',
                        fontSize: '0.9em'
                      }}
                    >
                      {children}
                    </Box>
                  )
                },
                h1: ({ children }) => (
                  <Text
                    as="h1"
                    fontSize="1.05rem"
                    fontWeight="semibold"
                    mt={1}
                    mb={2}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                h2: ({ children }) => (
                  <Text
                    as="h2"
                    fontSize="0.98rem"
                    fontWeight="semibold"
                    mt={2}
                    mb={1}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                h3: ({ children }) => (
                  <Text
                    as="h3"
                    fontSize="0.9rem"
                    fontWeight="semibold"
                    mt={2}
                    mb={1}
                    lineHeight="1.3"
                  >
                    {children}
                  </Text>
                ),
                blockquote: ({ children }) => (
                  <Box
                    as="blockquote"
                    style={{
                      borderLeft: '2px solid rgba(255,255,255,0.15)',
                      margin: '8px 0',
                      paddingLeft: 10,
                      color: 'var(--chakra-colors-gray-300)'
                    }}
                  >
                    {children}
                  </Box>
                )
              }}
            >
              {data}
            </ReactMarkdown>
          </Box>
        )}
        {textToExplain && !isPending && !isError && !data && (
          <HStack mt={2}>
            <Button size="xs" variant="subtle" onClick={runExplain}>
              Explain Text
            </Button>
          </HStack>
        )}
      </Box>
    </PanelLayout>
  )
}
