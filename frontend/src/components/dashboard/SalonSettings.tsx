import { useEffect, useState } from "react"
import {
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { salonApi, SalonSettings as Salon } from "@/api/salon"

function SalonSettings() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<Salon>()
  const toast = useToast()

  useEffect(() => {
    loadSalonSettings()
  }, [])

  const loadSalonSettings = async () => {
    try {
      const response = await salonApi.getSalon()
      setSettings(response.data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Lỗi tải cài đặt salon",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleSave = async () => {
    if (!settings) return
  
    setIsLoading(true)
    try {
      await salonApi.updateSalon(settings)
      setIsEditing(false)
      toast({
        title: "Cài đặt đã được cập nhật",
        status: "success",
        duration: 3000,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật cài đặt",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!settings) return null

  return (
    <Stack spacing={6}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="md" mb={6}>
                Cài Đặt Salon
              </Heading>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <FormControl>
                  <FormLabel>Tên Salon</FormLabel>
                  <Input
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Điện Thoại</FormLabel>
                  <Input
                    value={settings.phoneNumber}
                    onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Địa Chỉ</FormLabel>
                  <Input
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Giờ Mở Cửa</FormLabel>
                  <Input
                    type="time"
                    value={settings.openingTime}
                    onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Giờ Đóng Cửa</FormLabel>
                  <Input
                    type="time"
                    value={settings.closingTime}
                    onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Tuần Dẫn Đầu</FormLabel>
                  <Input
                    type="number"
                    value={settings.leadWeeks}
                    onChange={(e) => setSettings({ ...settings, leadWeeks: parseInt(e.target.value, 10) })}
                    readOnly={!isEditing}
                  />
                </FormControl>

                <FormControl gridColumn={{ md: "span 2" }}>
                  <FormLabel>Mô Tả</FormLabel>
                  <Textarea
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    readOnly={!isEditing}
                    rows={4}
                  />
                </FormControl>
              </Grid>
            </Box>
            <Box>
              {isEditing ? (
                <Stack direction="row" spacing={4}>
                  <Button colorScheme="blue" onClick={handleSave} isLoading={isLoading}>
                    Lưu Thay Đổi
                  </Button>
                  <Button variant="ghost" onClick={() => setIsEditing(false)} isDisabled={isLoading}>
                    Hủy
                  </Button>
                </Stack>
              ) : (
                <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                  Chỉnh Sửa Cài Đặt
                </Button>
              )}
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Stack>
  )
}

export default SalonSettings
