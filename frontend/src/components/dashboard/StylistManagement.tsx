import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Stylist } from "@/types/stylists"
import { Edit, MoreVertical, Trash } from "lucide-react"
import { AxiosError } from "axios"
import { stylistsApi } from "@/api/stylists.ts"

function StylistManagement() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [editingStylist, setEditingStylist] = useState<Partial<Stylist> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadStylists()
  }, [])

  const loadStylists = async () => {
    try {
      const response = await stylistsApi.getStylists()
      setStylists(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải stylist",
        description: axiosError.response?.data?.message || "Không thể tải stylist",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStylist?.firstName || !editingStylist?.lastName || !editingStylist?.email) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tất cả các trường bắt buộc",
        status: "error",
        duration: 3000,
      })
      return
    }

    try {
      if (editingStylist.id) {
        // Update existing stylist
        await stylistsApi.updateStylist(editingStylist.id, editingStylist as Stylist)
      } else {
        // Create new stylist
        await stylistsApi.createStylist(editingStylist as Stylist)
      }

      loadStylists() // Reload all stylists
      onClose()
      setEditingStylist(null)
      toast({
        title: editingStylist.id ? "Stylist đã được cập nhật" : "Stylist đã được thêm",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi",
        description: axiosError.response?.data?.message || "Không thể lưu stylist",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleDelete = async () => {
    toast({
      title: "Xóa Stylist",
      description: "Tính năng này chưa được triển khai",
      status: "info",
      duration: 3000,
    })
  }

  if (isLoading) {
    return <Spinner size="xl" />
  }

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Button
          colorScheme="blue"
          onClick={() => {
            setEditingStylist({})
            onOpen()
          }}
        >
          Thêm Stylist Mới
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Stylist</Th>
              <Th>Liên Hệ</Th>
              <Th>Chuyên Môn</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {stylists.map((stylist) => (
              <Tr key={stylist.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar size="md" name={`${stylist.firstName} ${stylist.lastName}`} src={stylist.imageUrl} />
                    <Box>
                      <Box fontWeight="medium">
                        {stylist.firstName} {stylist.lastName}
                      </Box>
                      <Box fontSize="sm" color="gray.500">
                        {stylist.bio?.substring(0, 50)}...
                      </Box>
                    </Box>
                  </HStack>
                </Td>
                <Td>
                  <Box fontSize="sm">
                    <Box>{stylist.email}</Box>
                    <Box>{stylist.phoneNumber}</Box>
                  </Box>
                </Td>
                <Td>
                  <Box fontSize="sm">{stylist.specialties?.join(", ")}</Box>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                    <MenuList>
                      <MenuItem
                        icon={<Edit size={16} />}
                        onClick={() => {
                          setEditingStylist(stylist)
                          onOpen()
                        }}
                      >
                        Chỉnh Sửa Stylist
                      </MenuItem>
                      <MenuItem icon={<Trash size={16} />} color="red.500" onClick={() => handleDelete()}>
                        Xóa Stylist
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>{editingStylist?.id ? "Chỉnh Sửa Stylist" : "Thêm Stylist Mới"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <FormControl isRequired>
                  <FormLabel>Tên</FormLabel>
                  <Input
                    value={editingStylist?.firstName || ""}
                    onChange={(e) =>
                      setEditingStylist({
                        ...editingStylist,
                        firstName: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Họ</FormLabel>
                  <Input
                    value={editingStylist?.lastName || ""}
                    onChange={(e) =>
                      setEditingStylist({
                        ...editingStylist,
                        lastName: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </Grid>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={editingStylist?.email || ""}
                  onChange={(e) =>
                    setEditingStylist({
                      ...editingStylist,
                      email: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Số Điện Thoại</FormLabel>
                <Input
                  value={editingStylist?.phoneNumber || ""}
                  onChange={(e) =>
                    setEditingStylist({
                      ...editingStylist,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tiểu Sử</FormLabel>
                <Textarea
                  value={editingStylist?.bio || ""}
                  onChange={(e) =>
                    setEditingStylist({
                      ...editingStylist,
                      bio: e.target.value,
                    })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Chuyên Môn (ngăn cách bằng dấu phẩy)</FormLabel>
                <Input
                  value={editingStylist?.specialties?.join(", ") || ""}
                  onChange={(e) =>
                    setEditingStylist({
                      ...editingStylist,
                      specialties: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  placeholder="ví dụ: Nhuộm Tóc, Nối Tóc, Tạo Kiểu Cô Dâu"
                />
              </FormControl>
              <FormControl>
                <FormLabel>URL Hình Ảnh Hồ Sơ</FormLabel>
                <Input
                  value={editingStylist?.imageUrl || ""}
                  onChange={(e) =>
                    setEditingStylist({
                      ...editingStylist,
                      imageUrl: e.target.value,
                    })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" colorScheme="blue">
              {editingStylist?.id ? "Lưu Thay Đổi" : "Thêm Stylist"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default StylistManagement
