import {
  Box,
  DataListRoot,
  EmptyState,
  Flex,
  Input,
  SegmentGroup,
  Stack,
  VStack
} from '@chakra-ui/react'

import { SkeletonText } from '../../../ui/Skeleton'
import { LuSearch } from 'react-icons/lu'
import { InputGroup } from '../../../ui/InputGroup'
import { useTemplates } from '@renderer/hooks/useTemplates'
import { useMemo, useState } from 'react'
import { useCategories } from '@renderer/hooks/useCategories'
import { GoBook } from 'react-icons/go'
import { TemplateCard } from './TemplateCard'

export const TemplateList = (): JSX.Element => {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const [term, setTerm] = useState<string>('')

  const { data: templates, isLoading: isLoadingTemplates } = useTemplates({
    term
  })

  const { data: categories, isLoading: isLoadingCategories } = useCategories()
  const isLoading = isLoadingTemplates || isLoadingCategories

  const filteredTemplatesWithCategories = useMemo(() => {
    if (isLoading) return
    return templates
      ?.map((template) => {
        const category = categories?.find((category) => category.ID == template.category_id)
        return {
          ...template,
          category: category?.label || 'Uncategorized'
        }
      })
      .filter((item) => {
        if (!selectedCategory) return true
        if (selectedCategory === 'all') return true
        return item.category_id == selectedCategory
      })
  }, [isLoading, templates, categories, selectedCategory])

  return (
    <Box>
      {isLoading ? (
        <SkeletonText noOfLines={4} />
      ) : (
        <DataListRoot unstyled>
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
                colorPalette="green"
                borderRadius={0}
                size={'lg'}
                placeholder="Search templates"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                }}
              />
            </InputGroup>
          </Flex>
          {categories && (
            <SegmentGroup.Root
              defaultValue="all"
              colorPalette="green"
              size="xs"
              mb={2}
              value={selectedCategory}
              onValueChange={({ value }) => {
                setSelectedCategory(value)
              }}
            >
              <SegmentGroup.Indicator />
              <SegmentGroup.Items
                items={[
                  { value: 'all', label: 'All' },
                  ...categories.map(({ ID, label }) => ({
                    value: String(ID),
                    label
                  }))
                ]}
              />
            </SegmentGroup.Root>
          )}

          <Stack gap="2" direction="row" wrap="wrap">
            {filteredTemplatesWithCategories?.length === 0 && (
              <EmptyState.Root>
                <EmptyState.Content>
                  <EmptyState.Indicator>
                    <GoBook />
                  </EmptyState.Indicator>
                  <VStack textAlign="center">
                    <EmptyState.Title>No result</EmptyState.Title>
                    <EmptyState.Description>
                      No templates found. Try to search for something else.
                    </EmptyState.Description>
                  </VStack>
                </EmptyState.Content>
              </EmptyState.Root>
            )}
            {filteredTemplatesWithCategories?.map((item) => (
              <TemplateCard key={item.ID} template={item} />
            ))}
          </Stack>
        </DataListRoot>
      )}
    </Box>
  )
}
