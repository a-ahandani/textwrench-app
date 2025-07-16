import { ButtonGroup, IconButton } from '@chakra-ui/react'

import { GoSearch } from 'react-icons/go'
import { FixIt } from './actions/FixIt/FixIt'
import { MyPrompts } from './actions/MyPrompts/MyPrompts'

function ToolbarApp(): JSX.Element {
  return (
    <ButtonGroup size={'2xs'} variant="subtle" attached>
      <FixIt />
      <MyPrompts />
      <IconButton>
        <GoSearch />
      </IconButton>
    </ButtonGroup>
  )
}

export default ToolbarApp
