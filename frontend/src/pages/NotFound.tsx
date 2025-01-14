import { Button, Container, Heading, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { Home } from "lucide-react"
import { useNavigate } from "react-router"
import Layout from "@/components/Layout"

function NotFoundPage() {
  const navigate = useNavigate()
  const textColor = useColorModeValue("gray.600", "gray.400")

  return (
    <Layout>
      <Container maxW="lg" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading size="4xl">404</Heading>
          <VStack spacing={4}>
            <Heading size="xl">Không Tìm Thấy Trang</Heading>
            <Text color={textColor}>Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</Text>
          </VStack>
          <Button leftIcon={<Home size={20} />} colorScheme="blue" size="lg" onClick={() => navigate("/")}>
            Trở về Trang chủ
          </Button>
        </VStack>
      </Container>
    </Layout>
  )
}

export default NotFoundPage
