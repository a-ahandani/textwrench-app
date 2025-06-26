import { Box, Button, EmptyState, RadioCard, VStack } from '@chakra-ui/react'
import { SkeletonText } from '../../../ui/Skeleton'
import { usePrompts } from '@renderer/hooks/usePrompts'
import { GoBookmarkFill } from 'react-icons/go'
import { usePromptsContext } from './PromptsContext'
import { useRoute } from '@renderer/components/providers/RouteProvider'
import { PromptCard } from './PromptCard'
import { useSearch } from '@renderer/components/providers/SearchProvider'

export const PromptList = (): JSX.Element => {
  const { searchTerm: term } = useSearch()

  const { setEditingId, setDefaultPrompt } = usePromptsContext()
  const { setCurrentRoute } = useRoute()

  const { data: prompts, isLoading } = usePrompts({
    term
  })

  const handleSelectPrompt = (prompt): void => {
    const selectedPrompt = prompts?.find((p) => p.ID == prompt.target.value)
    if (!selectedPrompt) {
      return
    }
    setDefaultPrompt(selectedPrompt)
  }

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <>
          {term.length && prompts?.length === 0 ? (
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
          ) : null}

          {!term.length && prompts?.length === 0 && (
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

          <RadioCard.Root
            onChange={handleSelectPrompt}
            variant="subtle"
            defaultValue={prompts?.[0]?.ID}
            gap="4"
            width="100%"
          >
            {prompts?.map((item) => <PromptCard key={item.ID} prompt={item} />)}
          </RadioCard.Root>
        </>
      )}
    </Box>
  )
}
