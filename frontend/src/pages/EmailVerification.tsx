import { Box, Button, Container, Heading, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { AxiosError } from "axios"
import AuthLayout from "@/components/auth/AuthLayout"
import { authApi } from "@/api/auth"

function EmailVerificationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const handleVerification = async () => {
    if (!token || !email) {
      toast({
        title: "Yêu cầu không hợp lệ",
        description: "Thiếu mã xác minh hoặc email",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.verifyEmail({ email, token: token })

      setIsVerified(true)
      toast({
        title: "Email đã được xác minh",
        description: "Email của bạn đã được xác minh thành công!",  
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Xác minh thất bại",
        description: axiosError.response?.data?.message || "Không thể xác minh email của bạn. Vui lòng thử lại.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Yêu cầu không hợp lệ",
        description: "Không có địa chỉ email được cung cấp",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.resendVerification({ email })

      toast({
        title: "Email xác minh đã được gửi",
        description: "Một email xác minh mới đã được gửi đến hộp thư của bạn",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Gửi thất bại",
        description: axiosError.response?.data?.message || "Không thể gửi email xác minh. Vui lòng thử lại.",
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
            <Heading size="xl">Xác minh Email</Heading>
            <Text color={useColorModeValue("gray.600", "gray.400")}>
            {isVerified ? "Email của bạn đã được xác minh" : "Vui lòng xác minh địa chỉ email của bạn để tiếp tục"}
            </Text>
          </VStack>

          <Box w="full" bg={useColorModeValue("white", "gray.800")} boxShadow="lg" p={8} rounded="lg">
            <VStack spacing={6}>
              {!isVerified ? (
                <>
                  <Text align="center">
                    {token
                      ? "Nhấp vào nút bên dưới để xác minh địa chỉ email của bạn"
                      : `Chúng tôi đã gửi một email xác minh đến ${email || "địa chỉ email của bạn"}. Nhấp vào liên kết trong email để xác minh tài khoản của bạn.`}
                  </Text>
                  {token ? (
                    <Button
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      onClick={handleVerification}
                      isLoading={isLoading}
                    >
                      Xác minh Email
                    </Button>
                  ) : (
                    <Button
                      colorScheme="blue"
                      size="lg"
                      width="full"
                      onClick={handleResendVerification}
                      isLoading={isLoading}
                    >
                      Gửi lại Email Xác minh
                    </Button>
                  )}
                </>
              ) : (
                <VStack spacing={6}>
                  <Text>
                    Gửi lại Email Xác minh, Cảm ơn bạn đã xác minh địa chỉ email của mình. Bạn có thể truy cập tất cả các tính năng của tài khoản.                  </Text>
                  <Button colorScheme="blue" size="lg" width="full" onClick={() => navigate("/login")}>
                    Đi đến Đăng nhập
                  </Button>
                </VStack>
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </AuthLayout>
  )
}

export default EmailVerificationPage
