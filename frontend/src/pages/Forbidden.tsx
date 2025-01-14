import { Button, Container, Heading, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { ArrowLeft, Lock } from "lucide-react"
import { useNavigate } from "react-router"
import Layout from "@/components/Layout"

function ForbiddenPage() {
  const navigate = useNavigate()
  const textColor = useColorModeValue("gray.600", "gray.400")

  return (
    <Layout>
      <Container maxW="lg" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading size="4xl">403</Heading>
          <VStack spacing={4}>
            <Heading size="xl">Access Denied</Heading>
            <Text color={textColor}>Bạn không có quyền truy cập trang này.</Text>
            <Text color={textColor}>
              Vui lòng đăng nhập bằng tài khoản có quyền truy cập hoặc liên hệ hỗ trợ nếu bạn nghĩ rằng đây là một sự nhầm lẫn.            </Text>
          </VStack>
          <VStack spacing={4}>
            <Button leftIcon={<ArrowLeft size={20} />} colorScheme="blue" size="lg" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
            <Button leftIcon={<Lock size={20} />} variant="outline" size="lg" onClick={() => navigate("/login")}>
              Đăng nhập
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Layout>
  )
}

export default ForbiddenPage
