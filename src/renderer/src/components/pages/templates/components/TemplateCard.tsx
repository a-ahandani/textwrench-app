import { Box, Button, Card } from '@chakra-ui/react'
import { Tag } from '@renderer/components/ui/Tag'
import { useCreatePrompt } from '@renderer/hooks/useCreatePrompt'
import { Template } from '@shared/types/store'
import { useState } from 'react'

export const TemplateCard = ({
  template
}: {
  template: Template & {
    category: string
  }
}): JSX.Element => {
  const [isSaved, SetIsSaved] = useState(false)
  const { mutate: createPrompt, isPending: isCreating } = useCreatePrompt({
    onSuccess: () => {
      SetIsSaved(true)
    }
  })
  const handleCreatePrompt = (): void => {
    createPrompt({
      label: template.label,
      value: template.value
    })
  }
  return (
    <Card.Root
      width={{
        base: '100%',
        md: 'calc(50% - 5px)',
        xl: 'calc(33.33% - 6px)',
        '2xl': 'calc(20% - 7px)'
      }}
      key={template.ID}
    >
      <Card.Header fontWeight="bold" pb={0}>
        {template.label}
        <Box>
          <Tag colorScheme="green" ml={1}>
            {template.category}
          </Tag>
        </Box>
      </Card.Header>
      <Card.Body py={1} fontSize="sm" fontWeight={'light'}>
        {template.value}
      </Card.Body>
      <Card.Footer pt={1}>
        <Button
          size="xs"
          variant="solid"
          colorPalette="green"
          onClick={handleCreatePrompt}
          loading={isCreating}
          disabled={isSaved}
        >
          {isSaved ? 'Added!' : 'Add to Prompts'}
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}
