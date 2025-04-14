import { Box, Button, EmptyState, Flex, IconButton, Input, Stack, VStack } from '@chakra-ui/react'
import { SkeletonText } from '../../../ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '../../../ui/InputGroup'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { useState } from 'react'
import { Tooltip } from '@renderer/components/ui/Tooltip'
import { GoBookmarkFill, GoPlus } from 'react-icons/go'
import { PromptForm } from './PromptForm'
import { usePromptsContext } from './PromptsContext'
import { useRoute } from '@renderer/components/providers/RouteProvider'
import { PromptCard } from './PromptCard'

export const PromptList = (): JSX.Element => {
  const { setEditingId } = usePromptsContext()
  const [term, setTerm] = useState<string>('')
  const { setCurrentRoute } = useRoute()

  const { data: prompts, isLoading } = usePrompts({
    term
  })

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <>
          <Flex alignItems={'center'} justifyContent={'center'} mb={2}>
            <InputGroup
              width="full"
              startElement={<LuSearch />}
              endElement={
                <Tooltip
                  content="Add Prompt"
                  aria-label="Add Prompt"
                  positioning={{ placement: 'left' }}
                >
                  <IconButton
                    onClick={() => {
                      setEditingId('new')
                    }}
                    colorPalette="green"
                    size="lg"
                    borderRadius={0}
                    aria-label="Add Prompt"
                    mr={-2}
                    variant="solid"
                  >
                    <GoPlus />
                  </IconButton>
                </Tooltip>
              }
            >
              <Input
                variant="subtle"
                _active={{
                  borderColor: 'transparent',
                  boxShadow: 'none'
                }}
                _focus={{
                  borderColor: 'transparent',
                  boxShadow: 'none'
                }}
                colorPalette="green"
                borderRadius={0}
                size={'lg'}
                placeholder="Search prompts"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                }}
              />
            </InputGroup>
          </Flex>

          {term && prompts?.length === 0 && (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <GoBookmarkFill />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No result</EmptyState.Title>
                  <EmptyState.Description>
                    No prompts found. Try to search for something else or look for a{' '}
                    <Button
                      onClick={() => setCurrentRoute('templates')}
                      variant="subtle"
                      colorPalette="green"
                      size="xs"
                    >
                      template
                    </Button>
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          )}

          {!term && prompts?.length === 0 && (
            <EmptyState.Root>
              <EmptyState.Content>
                <EmptyState.Indicator>
                  <GoBookmarkFill />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                  <EmptyState.Title>No prompts!</EmptyState.Title>
                  <EmptyState.Description>
                    <Button
                      onClick={() => {
                        setEditingId('new')
                      }}
                      variant="subtle"
                      colorPalette="green"
                      size="xs"
                    >
                      Add
                    </Button>{' '}
                    a custom prompt to get started or use{' '}
                    <Button
                      onClick={() => setCurrentRoute('templates')}
                      variant="subtle"
                      colorPalette="green"
                      size="xs"
                    >
                      templates
                    </Button>{' '}
                    to create a new one.
                  </EmptyState.Description>
                </VStack>
              </EmptyState.Content>
            </EmptyState.Root>
          )}

          <Stack gap="2" direction="row" wrap="wrap">
            {prompts?.map((item) => <PromptCard key={item.ID} prompt={item} />)}
          </Stack>
        </>
      )}
      <PromptForm />
    </Box>
  )
}
