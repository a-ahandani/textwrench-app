import { Box, Card, HStack, Kbd, Input, IconButton, Button } from '@chakra-ui/react'
import { Field } from '@renderer/components/ui/Field'
import { InputGroup } from '@renderer/components/ui/InputGroup'
import { KEY_NAMES, LETTER_NUMBER_CODES, MODIFIERS, NON_MODIFIERS } from '@shared/constants'
import { useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { GoArrowLeft, GoX } from 'react-icons/go'

export const Hotkeys = ({
  label,
  value = [],
  onSubmit
}: {
  label: string
  value?: string[]
  onSubmit: (value) => void
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(value)
  const [isEditing, setIsEditing] = useState(false)

  const isValidShortcut = useMemo(() => {
    if (selectedKeys.length < 2) return false
    if (!MODIFIERS.includes(selectedKeys[0])) return false
    if (selectedKeys.length === 3 && !NON_MODIFIERS.includes(selectedKeys[1])) return false
    if (selectedKeys.length === 3 && !LETTER_NUMBER_CODES.includes(selectedKeys[2])) return false

    return true
  }, [selectedKeys])

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
    { keydown: true, keyup: false, enabled: isEditing }
  )

  return (
    <Card.Root my="2" variant="subtle">
      <Box p="4">
        <HStack gap="1">
          <Field orientation="horizontal" label={`${label}:`}>
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
              {...(selectedKeys.length &&
                isEditing && {
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
              <Input disabled variant={isEditing ? 'outline' : 'subtle'} />
            </InputGroup>
            <Button
              size="sm"
              variant="subtle"
              disabled={isEditing && !isValidShortcut}
              onClick={() => {
                setIsEditing(!isEditing)
                if (isEditing) {
                  onSubmit(selectedKeys)
                }
              }}
              colorPalette={isEditing ? 'green' : undefined}
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </Field>
        </HStack>
      </Box>
    </Card.Root>
  )
}
