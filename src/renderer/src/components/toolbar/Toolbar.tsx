import { ButtonGroup, IconButton } from '@chakra-ui/react'

import { GoSearch } from 'react-icons/go'
import { FixIt } from './actions/FixIt/FixIt'

function ToolbarApp(): JSX.Element {
  return (
    <ButtonGroup size={'2xs'} variant="subtle" attached>
      <FixIt />
      <IconButton>
        <GoSearch />
      </IconButton>
    </ButtonGroup>
  )
}

export default ToolbarApp
