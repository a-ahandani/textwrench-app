import { Box, Text } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { PropsWithChildren } from 'react'

export interface MarkdownProps {
  children: string
  px?: number | string
  withCursor?: boolean
  isStreaming?: boolean
}

/**
 * Unified Markdown renderer for the app.
 * Applies consistent typography and element styling.
 * Use this everywhere instead of raw <ReactMarkdown>.
 */
export function Markdown({
  children,
  px = 0,
  withCursor = false,
  isStreaming = false
}: PropsWithChildren<MarkdownProps>): JSX.Element {
  return (
    <Box
      fontSize="md"
      style={{
        lineHeight: '1.6',
        maxWidth: '100%',
        wordBreak: 'break-word',
        letterSpacing: '0.01em'
      }}
      px={px}
      aria-live="polite"
      _after={
        withCursor && isStreaming
          ? {
              content: '""',
              display: 'inline-block',
              width: '6px',
              height: '1em',
              ml: '2px',
              bg: 'gray.300',
              animation: 'cursorBlink 1s steps(2, start) infinite',
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
            <Text as="h1" fontSize="1.25rem" fontWeight="semibold" mt={2} mb={3} lineHeight="1.3">
              {children}
            </Text>
          ),
          h2: ({ children }) => (
            <Text as="h2" fontSize="1.1rem" fontWeight="semibold" mt={2} mb={2} lineHeight="1.3">
              {children}
            </Text>
          ),
          h3: ({ children }) => (
            <Text as="h3" fontSize="1.0rem" fontWeight="semibold" mt={2} mb={2} lineHeight="1.3">
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
        {children}
      </ReactMarkdown>
    </Box>
  )
}

export default Markdown
