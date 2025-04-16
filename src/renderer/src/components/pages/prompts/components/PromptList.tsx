import { Box, Button, EmptyState, Flex, Input, Stack, VStack } from '@chakra-ui/react'
import { SkeletonText } from '../../../ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '../../../ui/InputGroup'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { useState } from 'react'
import { GoBookmarkFill } from 'react-icons/go'
import { PromptForm } from './PromptForm'
import { usePromptsContext } from './PromptsContext'
import { useRoute } from '@renderer/components/providers/RouteProvider'
import { PromptCard } from './PromptCard'
import { PromptHead } from './PromptHead'

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
          <PromptHead />
          <Flex alignItems={'center'} justifyContent={'center'} mb={2}>
            <InputGroup width="full" startElement={<LuSearch />}>
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
