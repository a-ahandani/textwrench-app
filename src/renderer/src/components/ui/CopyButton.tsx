import { Button, ButtonProps } from '@chakra-ui/react'
import { FiCopy, FiCheck } from 'react-icons/fi'
import { useState } from 'react'

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** The text content to copy to clipboard */
  textToCopy: string
  /** Duration in milliseconds to show the "copied" state (default: 2000ms) */
  feedbackDuration?: number
  /** Text to show in default state (default: "Copy") */
  copyText?: string
  /** Text to show in copied state (default: "Copied!") */
  copiedText?: string
  /** Whether to show icons (default: true) */
  showIcon?: boolean
  /** Icon size (default: 12) */
  iconSize?: number
  /** Callback fired after successful copy */
  onCopySuccess?: () => void
  /** Callback fired if copy fails */
  onCopyError?: (error: Error) => void
}

export const CopyButton = ({
  textToCopy,
  feedbackDuration = 2000,
  copyText = 'Copy',
  copiedText = 'Copied!',
  showIcon = true,
  iconSize = 12,
  onCopySuccess,
  onCopyError,
  disabled,
  children,
  ...buttonProps
}: CopyButtonProps): JSX.Element => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async (): Promise<void> => {
    if (!textToCopy.trim()) return

    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
      onCopySuccess?.()

      // Reset the copied state after the specified duration
      setTimeout(() => setIsCopied(false), feedbackDuration)
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to copy text')
      onCopyError?.(err)
      console.error('Copy failed:', err)
    }
  }

  const isDisabled = disabled || !textToCopy.trim()

  return (
    <Button
      {...buttonProps}
      onClick={handleCopy}
      disabled={isDisabled}
      display="inline-flex"
      gap={showIcon ? 1 : 0}
    >
      {showIcon &&
        (isCopied ? (
          <FiCheck size={iconSize} aria-hidden />
        ) : (
          <FiCopy size={iconSize} aria-hidden />
        ))}
      {children || (isCopied ? copiedText : copyText)}
    </Button>
  )
}
