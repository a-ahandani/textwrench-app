import { Box, Card, HStack, Kbd, Input, IconButton } from '@chakra-ui/react'
import { InputGroup } from '@renderer/components/ui/InputGroup'
import { KEY_NAMES, LETTER_NUMBER_CODES, MODIFIERS, NON_MODIFIERS } from '@shared/constants'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { GoArrowLeft, GoX } from 'react-icons/go'

export const Hotkeys = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useHotkeys(
    '*',
    (event) => {
      event.preventDefault()
      const { code } = event

      // Ignore repeated keys
      if (selectedKeys.includes(code)) return

      // if last key is letter or number, ignore all other keys
      if (LETTER_NUMBER_CODES.includes(selectedKeys[selectedKeys.length - 1])) {
        return
      }

      // Handle first key: Must be a modifier
      if (selectedKeys.length === 0) {
        if (!MODIFIERS.includes(code)) return
        setSelectedKeys([code])
        return
      }

      // Handle second key: Can be another modifier or shift (optional) or letter/number
      if (selectedKeys.length === 1) {
        if (LETTER_NUMBER_CODES.includes(code)) {
          setSelectedKeys([...selectedKeys, code])
        } else if (MODIFIERS.includes(code) || NON_MODIFIERS.includes(code)) {
          setSelectedKeys([...selectedKeys, code])
        }
        return
      }

      // Handle third key (if applicable)
      if (selectedKeys.length === 2) {
        if (LETTER_NUMBER_CODES.includes(code)) {
          setSelectedKeys([...selectedKeys.filter((k) => !LETTER_NUMBER_CODES.includes(k)), code])
        }
      }
    },
    { keydown: true, keyup: false }
  )

  return (
    <Card.Root>
      <Box p="4">
        <Box mb="2">
          <HStack gap="1">
            <InputGroup
              flex="1"
              startElement={
                <>
                  {selectedKeys.map((key) => {
                    return (
                      <Kbd variant="raised" size="sm" key={key}>
                        {KEY_NAMES[key]}
                      </Kbd>
                    )
                  })}
                </>
              }
              {...(selectedKeys.length && {
                endElement: (
                  <>
                    <IconButton
                      variant="ghost"
                      size="xs"
                      rounded="full"
                      onClick={() => {
                        setSelectedKeys(selectedKeys.slice(0, -1))
                      }}
                    >
                      <GoArrowLeft />
                    </IconButton>

                    <IconButton
                      onClick={() => setSelectedKeys([])}
                      size="xs"
                      variant="ghost"
                      rounded="full"
                    >
                      <GoX />
                    </IconButton>
                  </>
                )
              })}
            >
              <Input disabled />
            </InputGroup>
          </HStack>
        </Box>
      </Box>
    </Card.Root>
  )
}
