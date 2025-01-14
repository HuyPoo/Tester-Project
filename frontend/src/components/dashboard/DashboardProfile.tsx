import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Spinner,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { AxiosError } from "axios"
import { authApi } from "@/api/auth"
import { stylistsApi } from "@/api/stylists"
import { Stylist } from "@/types/stylists"

function DashboardProfile() {
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profile, setProfile] = useState<Stylist>()
  const toast = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await stylistsApi.getMyProfile()
      setProfile(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải hồ sơ",
        description: axiosError.response?.data?.message || "Không thể tải hồ sơ",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async () => {
    try {
      setIsEditing(false)
      const response = await stylistsApi.updateMyProfile(profile!)
      setProfile(response.data)
      toast({
        title: "Hồ sơ đã được cập nhật",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Cập nhật thất bại",
        description: axiosError.response?.data?.message || "Không thể cập nhật hồ sơ",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu mới không khớp",
        status: "error",
        duration: 3000,
      })
      return
    }
  
    try {
      await authApi.changePassword({
        oldPassword: currentPassword,
        newPassword,
      })
  
      toast({
        title: "Thành công",
        description: "Mật khẩu đã được cập nhật",
        status: "success",
        duration: 3000,
      })
      setIsChangingPassword(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi",
        description: axiosError.response?.data?.message || "Không thể cập nhật mật khẩu",
        status: "error",
        duration: 3000,
      })
    }
  }

  if (isLoading || !profile) {
    return <Spinner size="xl" />
  }

  return (
    <Stack spacing={6}>
      {/* Profile Information */}
      <Card>
        <CardBody>
          <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={8}>
            <GridItem>
              <VStack>
                <Avatar size="2xl" name={`${profile.firstName} ${profile.lastName}`} src={profile.imageUrl} />
                {isEditing && (
                  <FormControl>
                    <FormLabel>URL Hình Ảnh</FormLabel>
                    <Input
                      value={profile.imageUrl || ""}
                      onChange={(e) => setProfile({ ...profile, imageUrl: e.target.value })}
                      placeholder="https://placehold.co/600x400"
                    />
                  </FormControl>
                )}
              </VStack>
            </GridItem>
            <GridItem>
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Heading size="md" mb={6}>
                    Thông Tin Hồ Sơ
                  </Heading>
                  <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                    <FormControl>
                      <FormLabel>Họ</FormLabel>
                      <Input
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Tên</FormLabel>
                      <Input
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        readOnly
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Điện Thoại</FormLabel>
                      <Input
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                        readOnly={!isEditing}
                      />
                    </FormControl>
                  </Grid>
                </Box>
                {isEditing && (
                  <Box>
                    <Button colorScheme="blue" onClick={handleProfileUpdate} mr={3}>
                      Lưu Thay Đổi
                    </Button>
                    <Button variant="ghost" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </Box>
                )}
                {!isEditing && <Button onClick={() => setIsEditing(true)}>Chỉnh Sửa Hồ Sơ</Button>}
              </VStack>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardBody>
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Đổi Mật Khẩu</Heading>
            {!isChangingPassword ? (
              <Button w="fit-content" onClick={() => setIsChangingPassword(true)}>
                Đổi Mật Khẩu
              </Button>
            ) : (
              <VStack align="stretch" spacing={4}>
                <FormControl>
                  <FormLabel>Mật Khẩu Hiện Tại</FormLabel>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Mật Khẩu Mới</FormLabel>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>Xác Nhận Mật Khẩu Mới</FormLabel>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
                <Box>
                  <Button colorScheme="blue" mr={3} onClick={handlePasswordChange}>
                    Cập Nhật Mật Khẩu
                  </Button>
                  <Button variant="ghost" onClick={() => setIsChangingPassword(false)}>
                    Hủy
                  </Button>
                </Box>
              </VStack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Stack>
  )
}

export default DashboardProfile
