import { Box, Heading, Link, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import AuthLayout from "../components/auth/AuthLayout"
import LoginForm from "../components/auth/LoginForm"
import { Link as RouterLink, useNavigate } from "react-router"
import useSignIn from "react-auth-kit/hooks/useSignIn"
import { authApi, LoginCredentials } from "@/api/auth.ts"
import { Roles, UserState } from "@/types/users.ts"
import { AxiosError } from "axios"

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()
  const signIn = useSignIn<UserState>()

  const handleLogin = async (data: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(data)
      signIn({
        auth: {
          token: response.data.accessToken,
          type: "Bearer",
        },
        userState: {
          userId: response.data.userId,
          role: response.data.role,
        },
      })

      toast({
        title: "Đăng nhập thành công",
        status: "success",
        duration: 3000,
      })

      if (response.data.role === Roles.Stylist || response.data.role === Roles.Manager) {
        navigate("/dashboard")
      } else {
        navigate("/appointments")
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Đăng nhập thất bại",
        description: axiosError.response?.data?.message || "Vui lòng kiểm tra thông tin đăng nhập của bạn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <VStack spacing={8} w="full">
        <VStack spacing={2} textAlign="center">
          <Heading size="xl">Chào mừng bạn trở lại</Heading>
          <Text color={useColorModeValue("gray.600", "gray.400")}>Đăng nhập vào tài khoản của bạn để tiếp tục</Text>
        </VStack>

        <Box w="full" bg={useColorModeValue("white", "gray.800")} rounded="lg" p={8} boxShadow="lg">
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
        </Box>

        <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")}>
          Chưa có tài khoản?{" "}
          <Link color="blue.500" as={RouterLink} to="/register">
            Sign up
          </Link>
          {" | "}
          <Link color="blue.500" as={RouterLink} to="/forgot-password">
            Quên mật khẩu
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  )
}

export default LoginPage
