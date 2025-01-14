import { Box, Heading, Link, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { Link as RouterLink, useNavigate } from "react-router"
import AuthLayout from "../components/auth/AuthLayout"
import RegisterForm from "../components/auth/RegisterForm"
import { authApi, RegisterCredentials } from "@/api/auth"
import { AxiosError } from "axios"

function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleRegister = async (data: RegisterCredentials) => {
    setIsLoading(true)
    try {
      await authApi.register(data)
      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng kiểm tra email để xác minh tài khoản của bạn",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Redirect to email verification page
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Đăng ký thất bại",
        description: axiosError.response?.data?.message || "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <VStack spacing={8} w="full">
        <VStack spacing={2} textAlign="center">
          <Heading size="xl">Tạo Tài Khoản</Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>Điền thông tin của bạn để bắt đầu</Text>
        </VStack>

        <Box w="full" bg={useColorModeValue("white", "gray.800")} rounded="lg" p={8} boxShadow="lg">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </Box>

        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
          Đã có tài khoản?{" "}
          <Link color="blue.500" as={RouterLink} to="/login">
            Đăng nhập
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  )
}

export default RegisterPage
