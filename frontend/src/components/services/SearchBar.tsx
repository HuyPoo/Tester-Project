import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { Search } from "lucide-react"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <InputGroup maxW="md">
      <InputLeftElement pointerEvents="none">
        <Search size={20} />
      </InputLeftElement>
      <Input
        placeholder="Search services..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        borderRadius="full"
      />
    </InputGroup>
  )
}

export default SearchBar
