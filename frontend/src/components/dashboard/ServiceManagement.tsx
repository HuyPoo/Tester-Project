import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Image,
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
  NumberInput,
  NumberInputField,
  Spinner,
  Stack as ChakraStack,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Edit, Image as ImageIcon, MoreVertical, Trash, Users } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { Service } from "@/types/services"
import { formatDuration, formatPrice } from "@/utils/formats"
import { servicesApi } from "@/api/services"
import { AxiosError } from "axios"
import { stylistsApi } from "@/api/stylists.ts"
import { Stylist } from "@/types/stylists.ts"

interface ServiceWithStylists extends Service {
  stylistIds?: string[]
}

function ServiceManagement() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [services, setServices] = useState<ServiceWithStylists[]>([])
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [editingService, setEditingService] = useState<ServiceWithStylists | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedStylistIds, setSelectedStylistIds] = useState<string[]>([])

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [servicesResponse, stylistsResponse] = await Promise.all([
        servicesApi.getServices(),
        stylistsApi.getStylists(),
      ])
  
      // For each service, get its assigned stylists
      const servicesWithStylists = await Promise.all(
        servicesResponse.data.map(async (service) => {
          const stylistsResponse = await servicesApi.getServiceStylists(service.id)
          return {
            ...service,
            stylistIds: stylistsResponse.data.map((stylist) => stylist.id),
          }
        }),
      )
  
      setServices(servicesWithStylists)
      setStylists(stylistsResponse.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải dữ liệu",
        description: axiosError.response?.data?.message || "Không thể tải dịch vụ",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleAssignStylists = (service: ServiceWithStylists) => {
    setEditingService(service)
    setSelectedStylistIds(service.stylistIds || [])
    setIsAssignModalOpen(true)
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingService?.name || !editingService?.price || !editingService?.durationMinutes) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền tất cả các trường bắt buộc",
        status: "error",
        duration: 3000,
      })
      return
    }
  
    try {
      if (editingService.id) {
        // Update existing service
        await servicesApi.updateService(editingService.id, editingService)
      } else {
        // Create new service
        await servicesApi.createService(editingService)
      }
  
      loadData() // Reload all data
      onClose()
      setEditingService(null)
      toast({
        title: editingService.id ? "Dịch vụ đã được cập nhật" : "Dịch vụ đã được thêm",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi",
        description: axiosError.response?.data?.message || "Không thể lưu dịch vụ",
        status: "error",
        duration: 3000,
      })
    }
  }
  
  const handleStylistAssignment = async (selectedStylistIds: string[]) => {
    if (!editingService) return
  
    try {
      // Remove all current stylists
      const currentStylistIds = editingService.stylistIds || []
      await Promise.all(
        currentStylistIds.map((stylistId) => servicesApi.removeServiceStylist(editingService.id, stylistId)),
      )
  
      // Add new stylists
      await Promise.all(
        selectedStylistIds.map((stylistId) => servicesApi.addServiceStylist(editingService.id, stylistId)),
      )
  
      setIsAssignModalOpen(false)
      loadData() // Reload all data
      toast({
        title: "Stylist đã được gán",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi",
        description: axiosError.response?.data?.message || "Không thể gán stylist",
        status: "error",
        duration: 3000,
      })
    }
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
            setEditingService(null)
            onOpen()
          }}
        >
          Thêm Dịch Vụ Mới
        </Button>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Hình Ảnh</Th>
              <Th>Tên</Th>
              <Th>Mô Tả</Th>
              <Th>Giá</Th>
              <Th>Thời Gian</Th>
              <Th>Stylist Được Gán</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {services.map((service) => (
              <Tr key={service.id}>
                <Td>
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                  ) : (
                    <Box
                      boxSize="50px"
                      bg="gray.100"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={ImageIcon} color="gray.400" />
                    </Box>
                  )}
                </Td>
                <Td>{service.name}</Td>
                <Td>{service.description}</Td>
                <Td>{formatPrice(service.price)}</Td>
                <Td>{formatDuration(service.durationMinutes)}</Td>
                <Td>{service.stylistIds?.length || 0} stylist</Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                    <MenuList>
                      <MenuItem
                        icon={<Edit size={16} />}
                        onClick={() => {
                          setEditingService(service)
                          onOpen()
                        }}
                      >
                        Chỉnh Sửa Dịch Vụ
                      </MenuItem>
                      <MenuItem icon={<Users size={16} />} onClick={() => handleAssignStylists(service)}>
                        Gán Stylist
                      </MenuItem>
                      <MenuItem
                        icon={<Trash size={16} />}
                        color="red.500"
                        onClick={() => {
                          toast({
                            title: "Xóa dịch vụ",
                            description: "Tính năng này chưa được triển khai",
                            status: "info",
                            duration: 3000,
                          })
                        }}
                      >
                        Xóa
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
          <ModalHeader>{editingService?.id ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ Mới"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <HStack spacing={4} width="full">
                <Box flex={1}>
                  <FormControl isRequired>
                    <FormLabel>Tên</FormLabel>
                    <Input
                      value={editingService?.name || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          name: e.target.value,
                        } as Service)
                      }
                    />
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl>
                    <FormLabel>URL Hình Ảnh</FormLabel>
                    <Input
                      value={editingService?.imageUrl || ""}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          imageUrl: e.target.value,
                        } as Service)
                      }
                      placeholder="https://placehold.co/600x400"
                    />
                  </FormControl>
                </Box>
              </HStack>

              <FormControl isRequired>
                <FormLabel>Mô Tả</FormLabel>
                <Textarea
                  value={editingService?.description || ""}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    } as Service)
                  }
                />
              </FormControl>

              <HStack spacing={4} width="full">
                <FormControl isRequired>
                  <FormLabel>Giá</FormLabel>
                  <NumberInput
                    value={editingService?.price || ""}
                    onChange={(value) =>
                      setEditingService({
                        ...editingService,
                        price: Number(value),
                      } as Service)
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Thời Gian (phút)</FormLabel>
                  <NumberInput
                    value={editingService?.durationMinutes || ""}
                    onChange={(value) =>
                      setEditingService({
                        ...editingService,
                        durationMinutes: Number(value),
                      } as Service)
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </HStack>

              {editingService?.imageUrl && (
                <Box>
                  <FormLabel>Xem Trước Hình Ảnh</FormLabel>
                  <Image
                    src={editingService.imageUrl}
                    alt="Xem trước dịch vụ"
                    maxH="200px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" colorScheme="blue">
              {editingService?.id ? "Lưu Thay Đổi" : "Thêm Dịch Vụ"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Stylist Assignment Modal */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Gán Stylist - {editingService?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Chọn Stylist</FormLabel>
                <CheckboxGroup
                  value={selectedStylistIds}
                  onChange={(values) => setSelectedStylistIds(values as string[])}
                >
                  <ChakraStack spacing={2}>
                    {stylists.map((stylist) => (
                      <Checkbox key={stylist.id} value={stylist.id}>
                        <HStack spacing={2}>
                          <Avatar size="xs" name={`${stylist.firstName} ${stylist.lastName}`} src={stylist.imageUrl} />
                          <Text>
                            {stylist.firstName} {stylist.lastName}
                          </Text>
                        </HStack>
                      </Checkbox>
                    ))}
                  </ChakraStack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsAssignModalOpen(false)}>
              Hủy
            </Button>
            <Button
              colorScheme="blue"
              onClick={async () => {
                await handleStylistAssignment(selectedStylistIds)
              }}
            >
              Lưu Gán
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default ServiceManagement
