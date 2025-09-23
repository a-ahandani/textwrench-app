import { Input, InputGroup } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { useSearch } from '../providers/SearchProvider'
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'

export const SearchInput: React.FC = () => {
  const { searchTerm, setSearchTerm } = useSearch()
  const [localValue, setLocalValue] = useState<string>(searchTerm ?? '')

  useEffect(() => {
    setLocalValue(searchTerm ?? '')
  }, [searchTerm])

  const debouncedSet = useDebouncedCallback<[string]>((val) => setSearchTerm(val), 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val = e.currentTarget.value
    setLocalValue(val)
    debouncedSet(val)
  }

  return (
    <InputGroup
      startElement={<LuSearch color="#EDA220" />}
      borderColor={'transparent'}
      boxShadow="none"
    >
      <Input
        size={'sm'}
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
          visibility: 'visible'
        }}
        value={localValue}
        onChange={handleInputChange}
      />
    </InputGroup>
  )
}
