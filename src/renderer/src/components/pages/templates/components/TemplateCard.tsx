import { Box, Button, Card, IconButton } from '@chakra-ui/react'
import { Tag } from '@renderer/components/ui/Tag'
import { useCreatePrompt } from '@renderer/hooks/useCreatePrompt'
import { Template } from '@shared/types/store'
import { useState } from 'react'
import { GoCheck, GoPencil, GoPlus } from 'react-icons/go'
import { usePromptsContext } from '../../prompts/components/PromptsContext'
import { Tooltip } from '@renderer/components/ui/Tooltip'

export const TemplateCard = ({
  template
}: {
  template: Template & {
    category: string
  }
}): JSX.Element => {
  const [isSaved, SetIsSaved] = useState(false)
  const { setTemplateId } = usePromptsContext()
  const { mutate: createPrompt, isPending: isCreating } = useCreatePrompt({
    onSuccess: () => {
      SetIsSaved(true)
    }
  })
  const handleAddPrompt = (): void => {
    createPrompt({
      label: template.label,
      value: template.value
    })
  }
  const handleAddCustomPrompt = (): void => {
    setTemplateId(template.ID)
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
      <Card.Footer pt={1} pb={4}>
        <Box flex="1">
          <Button
            size="xs"
            variant="solid"
            colorPalette="green"
            onClick={handleAddPrompt}
            loading={isCreating}
            disabled={isSaved}
          >
            {isSaved ? <GoCheck /> : <GoPlus />}

            {isSaved ? 'Added!' : 'Add to My Prompts'}
          </Button>
        </Box>
        <Tooltip content="Customize this template & create a new prompt" aria-label="Customize">
          <IconButton
            variant="ghost"
            size="xs"
            onClick={handleAddCustomPrompt}
            loading={isCreating}
            aria-label="Customize"
          >
            <GoPencil />
          </IconButton>
        </Tooltip>
      </Card.Footer>
    </Card.Root>
  )
}
