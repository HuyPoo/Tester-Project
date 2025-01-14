import { Box, Container, Heading, Link, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { Link as RouterLink } from "react-router"
import { AxiosError } from "axios"
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm"
import AuthLayout from "@/components/auth/AuthLayout"
import { authApi } from "@/api/auth"

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const toast = useToast()
  const textColor = useColorModeValue("gray.600", "gray.400")

  const handleForgotPassword = async (data: { email: string }) => {
    setIsLoading(true)
    try {
      await authApi.forgotPassword(data)
      setEmailSent(true)
      toast({
        title: "Liên kết đặt lại đã được gửi",
        description: "Nếu có tài khoản tồn tại với email này, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Yêu cầu thất bại",
        description: axiosError.response?.data?.message || "Không thể gửi liên kết đặt lại. Vui lòng thử lại.",
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
      <Container maxW="lg" py={12}>
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl">Quên Mật Khẩu</Heading>
            {!emailSent ? (
              <Text color={textColor}>
                Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu
              </Text>
            ) : (
              <Text color={textColor}>Kiểm tra email của bạn để nhận hướng dẫn đặt lại mật khẩu</Text>
            )}
          </VStack>

          <Box w="full" bg={useColorModeValue("white", "gray.800")} boxShadow="lg" p={8} rounded="lg">
            <ForgotPasswordForm onSubmit={handleForgotPassword} isLoading={isLoading} emailSent={emailSent} />
          </Box>

          <Text fontSize="sm" color={textColor}>
            Nhớ mật khẩu của bạn?{" "}
            <Link as={RouterLink} to="/login" color="blue.500">
              Đăng nhập
            </Link>
          </Text>
        </VStack>
      </Container>
    </AuthLayout>
  )
}

export default ForgotPasswordPage
