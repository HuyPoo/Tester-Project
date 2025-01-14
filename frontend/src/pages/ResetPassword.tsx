import { Box, Container, Heading, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { AxiosError } from "axios"
import ResetPasswordForm from "@/components/auth/ResetPasswordForm"
import AuthLayout from "@/components/auth/AuthLayout"
import { authApi } from "@/api/auth"

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const textColor = useColorModeValue("gray.600", "gray.400")
  const bgColor = useColorModeValue("white", "gray.800")

  const handleResetPassword = async (data: { password: string }) => {
    if (!token || !email) {
      toast({
        title: "Yêu cầu không hợp lệ",
        description: "Thiếu mã đặt lại. Vui lòng yêu cầu liên kết đặt lại mật khẩu mới.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword({
        token,
        newPassword: data.password,
        email,
      })

      toast({
        title: "Đặt lại mật khẩu thành công",
        description: "Mật khẩu của bạn đã được đặt lại. Bạn có thể đăng nhập với mật khẩu mới.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })

      // Redirect to login page
      navigate("/login")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Đặt lại thất bại",
        description: 
        axiosError.response?.data?.message || 
        "Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu liên kết đặt lại mới.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout>
        <Container maxW="lg" py={12}>
          <VStack spacing={8}>
            <Heading size="xl" color="red.500">
              Liên kết đặt lại không hợp lệ
            </Heading>
            <Text align="center">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu liên kết đặt lại mật khẩu mới.
            </Text>
          </VStack>
        </Container>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Container maxW="lg" py={12}>
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl">Đặt lại mật khẩu</Heading>
            <Text color={textColor}>Nhập mật khẩu mới của bạn vào bên dưới</Text>
          </VStack>

          <Box w="full" bg={bgColor} boxShadow="lg" p={8} rounded="lg">
            <ResetPasswordForm onSubmit={handleResetPassword} isLoading={isLoading} />
          </Box>
        </VStack>
      </Container>
    </AuthLayout>
  )
}

export default ResetPasswordPage
