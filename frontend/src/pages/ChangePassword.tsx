import { Box, Container, Heading, useToast, VStack } from "@chakra-ui/react"
import { useState } from "react"
import { AxiosError } from "axios"
import Layout from "@/components/Layout"
import ChangePasswordForm from "@/components/auth/ChangePasswordForm"
import { authApi } from "@/api/auth"

function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleChangePassword = async (data: { currentPassword: string; newPassword: string }) => {
    setIsLoading(true)
    try {
      await authApi.changePassword({
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      toast({
        title: "Mật khẩu đã được cập nhật",
        description: "Mật khẩu của bạn đã được thay đổi thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Cập nhật thất bại",
        description: axiosError.response?.data?.message || "Không thể cập nhật mật khẩu. Vui lòng thử lại",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <Container maxW="lg" py={12}>
        <VStack spacing={8}>
          <Heading size="xl">Thay đổi mật khẩu</Heading>
          <Box w="full" boxShadow="lg" p={8} rounded="lg">
            <ChangePasswordForm onSubmit={handleChangePassword} isLoading={isLoading} />
          </Box>
        </VStack>
      </Container>
    </Layout>
  )
}

export default ChangePasswordPage
