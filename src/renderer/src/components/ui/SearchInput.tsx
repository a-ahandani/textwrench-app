import { Input, InputGroup } from '@chakra-ui/react'

import { LuSearch } from 'react-icons/lu'
import { useSearch } from '../providers/SearchProvider'

export const SearchInput = () => {
  const { searchTerm, setSearchTerm } = useSearch()

  const handleInputChange = (e) => {
    setSearchTerm(e.currentTarget.value)
  }

  return (
    <InputGroup
      startElement={<LuSearch color="#EDA220" />}
      borderColor={'transparent'}
      boxShadow="none"
    >
      <Input
        size={'md'}
        variant="flushed"
        fontWeight="light"
        borderColor={'transparent'}
        placeholder="Search"
        boxShadow="none"
        _focus={{
          _placeholder: { visibility: 'visible' }
        }}
        _placeholder={{
          color: 'gray.500',
          fontWeight: 'light',
          visibility: 'hidden'
        }}
        value={searchTerm}
        onChange={handleInputChange}
      />
    </InputGroup>
  )
}
