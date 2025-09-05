import { Box, HStack, Kbd, Input, IconButton } from '@chakra-ui/react'
import { Field } from '@renderer/components/ui/Field'
import { InputGroup } from '@renderer/components/ui/InputGroup'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { KEY_NAMES, LETTER_NUMBER_CODES, MODIFIERS, NON_MODIFIERS } from '@shared/constants'
import { useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { GoCheck, GoPencil, GoReply, GoX } from 'react-icons/go'

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
    if (!LETTER_NUMBER_CODES.includes(selectedKeys[selectedKeys.length - 1])) return false
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
      if (isValidShortcut) {
        if (MODIFIERS.includes(code) || NON_MODIFIERS.includes(code)) {
          setSelectedKeys([code])
        }
      }

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

      // Handle third key (if applicable)
      if (selectedKeys.length === 2) {
        if (LETTER_NUMBER_CODES.includes(code)) {
          setSelectedKeys([...selectedKeys.filter((k) => !LETTER_NUMBER_CODES.includes(k)), code])
        }
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
    },
    { keydown: true, keyup: false, enabled: isEditing }
  )

  return (
    <Box mt="2">
      <HStack gap="1">
        <Field orientation="horizontal" label={`${label}:`}>
          <InputGroup
            flex="1"
            startElement={
              <>
                {selectedKeys.map((key) => {
                  return (
                    <Kbd ml="-1" mr="2" variant="raised" size="sm" key={key}>
                      {KEY_NAMES[key]}
                    </Kbd>
                  )
                })}
              </>
            }
            endElement={
              <>
                {selectedKeys.length && isEditing ? (
                  <Tooltip content={'Delete'}>
                    <IconButton onClick={() => setSelectedKeys([])} size="xs" variant="ghost">
                      <GoX />
                    </IconButton>
                  </Tooltip>
                ) : null}

                <Tooltip content={!isValidShortcut ? 'Reset' : isEditing ? 'Save' : 'Edit'}>
                  <IconButton
                    mr="-2"
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      if (!isValidShortcut) {
                        setSelectedKeys(value)
                      }
                      setIsEditing(!isEditing)
                      if (isEditing) {
                        onSubmit(selectedKeys)
                      }
                    }}
                    colorPalette={!isValidShortcut ? 'yellow' : isEditing ? 'green' : 'blue'}
                  >
                    {isValidShortcut ? <> {isEditing ? <GoCheck /> : <GoPencil />}</> : <GoReply />}
                  </IconButton>
                </Tooltip>
              </>
            }
          >
            <Input
              borderColor={!isValidShortcut ? 'yellow' : isEditing ? 'green' : 'inherit'}
              disabled
              variant={isEditing ? 'outline' : 'subtle'}
            />
          </InputGroup>
        </Field>
      </HStack>
    </Box>
  )
}
