import {
  Avatar,
  Box,
  Card,
  CardBody,
  Divider,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Eye, MoreVertical, Search, Trash } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Customer } from "@/types/customers"
import { customersApi } from "@/api/customers"
import { AxiosError } from "axios"
import { Appointment } from "@/types/appointments"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"

function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerAppointments, setCustomerAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Load customers when component mounts
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setIsLoading(true)
      const response = await customersApi.getCustomers()
      setCustomers(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Error loading customers",
        description: axiosError.response?.data?.message || "Could not load customers",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phoneNumber.includes(query),
    )
  }, [customers, searchQuery])

  const handleViewCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer)
    onOpen()
    loadCustomerAppointments(customer.id)
  }

  const loadCustomerAppointments = async (customerId: string) => {
    try {
      setIsLoadingAppointments(true)
      const response = await customersApi.getCustomerAppointments(customerId)
      setCustomerAppointments(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải lịch hẹn",
        description: axiosError.response?.data?.message || "Không thể tải lịch hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  const handleDelete = async () => {
    toast({
      title: "Xóa khách hàng",
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
      {/* Customer List */}
      <Card>
        <CardBody>
          <Stack spacing={4}>
            <HStack>
              <InputGroup maxW="xs">
                <InputLeftElement pointerEvents="none">
                  <Search size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </HStack>

            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Khách hàng</Th>
                    <Th>Liên hệ</Th>
                    <Th>Thao tác</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCustomers.map((customer) => (
                    <Tr key={customer.id}>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar size="md" name={`${customer.firstName} ${customer.lastName}`} />
                          <Box>
                            <Text fontWeight="medium">
                              {customer.firstName} {customer.lastName}
                            </Text>
                          </Box>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">{customer.email}</Text>
                          <Text fontSize="sm">{customer.phoneNumber}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton as={IconButton} icon={<MoreVertical size={16} />} variant="ghost" size="sm" />
                          <MenuList>
                            <MenuItem icon={<Eye size={16} />} onClick={() => handleViewCustomer(customer)}>
                              Xem chi tiết
                            </MenuItem>
                            <MenuItem icon={<Trash size={16} />} color="red.500" onClick={() => handleDelete()}>
                              Xóa khách hàng
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      {/* Customer Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Chi tiết khách hàng</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCustomer && (
              <VStack spacing={6} align="stretch" pb={6}>
                <HStack spacing={4}>
                  <Avatar size="xl" name={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`} />
                  <Box>
                    <Text fontSize="xl" fontWeight="bold">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </Text>
                    <Text color="gray.600">{selectedCustomer.email}</Text>
                    <Text color="gray.600">{selectedCustomer.phoneNumber}</Text>
                  </Box>
                </HStack>

                <Divider />

                <Box>
                  <Text fontWeight="bold" mb={4}>
                    Lịch sử lịch hẹn
                  </Text>
                  {isLoadingAppointments ? (
                    <Spinner />
                  ) : (
                    <VStack spacing={3} align="stretch">
                      {customerAppointments.map((apt) => (
                        <Card key={apt.id} variant="outline">
                          <CardBody>
                            <HStack justify="space-between">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="medium">{apt.serviceId}</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {formatDate(apt.dateTime)} at {formatTime(apt.dateTime)}
                                </Text>
                              </VStack>
                              <Text fontWeight="medium">{formatPrice(apt.totalPrice)}</Text>
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default CustomerManagement
