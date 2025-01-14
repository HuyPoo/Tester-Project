import { Box, Container, useColorModeValue, VStack } from "@chakra-ui/react"
import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} py={20}>
      <Container maxW="lg">
        <VStack spacing={8}>{children}</VStack>
      </Container>
    </Box>
  )
}

export default AuthLayout
