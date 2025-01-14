import { Box, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  change?: string
}

function StatCard({ label, value, icon, change }: StatCardProps) {
  const bgColor = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.600", "gray.400")
  const changeColor = change?.startsWith("+") ? "green.500" : "red.500"

  return (
    <Box bg={bgColor} p={6} rounded="lg" shadow="sm">
      <HStack spacing={4} mb={2}>
        <Icon as={icon} boxSize={6} color="blue.500" />
        <Text fontSize="sm" color={textColor}>
          {label}
        </Text>
      </HStack>
      <HStack spacing={2}>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
        {change && (
          <Text fontSize="sm" color={changeColor}>
            {change}
          </Text>
        )}
      </HStack>
    </Box>
  )
}

export default StatCard