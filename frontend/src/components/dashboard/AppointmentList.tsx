import {
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
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
} from "@chakra-ui/react"
import { Check, Eye, MoreVertical, Search, ThumbsUp, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"
import { Appointment, AppointmentStatus } from "@/types/appointments.ts"
import { appointmentsApi } from "@/api/appointments.ts"
import { AxiosError } from "axios"
import { Roles, UserState } from "@/types/users.ts"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { stylistsApi } from "@/api/stylists.ts"
import { AppointmentDetailsModal } from "@/components/dashboard/AppointmentDetailsModal.tsx"
import { AppointmentCancelModal } from "@/components/dashboard/AppointmentCancelModal.tsx"
import { servicesApi } from "@/api/services.ts"
import { Service } from "@/types/services.ts"
import { AppointmentAcceptModal } from "@/components/dashboard/AppointmentAcceptModal.tsx"
import { customersApi } from "@/api/customers.ts"
import { Customer } from "@/types/customers.ts"

function AppointmentList() {
  const auth = useAuthUser<UserState>()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Record<string, Service>>({})
  const [customers, setCustomers] = useState<Record<string, Customer>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isCancelModalOpen, onOpen: onCancelModalOpen, onClose: onCancelModalClose } = useDisclosure()
  const { isOpen: isAcceptModalOpen, onOpen: onAcceptModalOpen, onClose: onAcceptModalClose } = useDisclosure()
  const toast = useToast()
  const [isCancelling, setIsCancelling] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const response =
        auth?.role === Roles.Manager ? await appointmentsApi.getAppointments() : await stylistsApi.getMyAppointments()

      const appointments = response.data

      // Get unique customer and service IDs
      const uniqueCustomerIds = [...new Set(appointments.map((apt) => apt.customerId))]
      const uniqueServiceIds = [...new Set(appointments.map((apt) => apt.serviceId))]

      // Load customers and services data in parallel
      const [customersResponse, servicesResponse] = await Promise.all([
        Promise.all(uniqueCustomerIds.map((id) => customersApi.getCustomer(id))),
        Promise.all(uniqueServiceIds.map((id) => servicesApi.getService(id))),
      ])

      // Create lookup maps
      const customersMap = customersResponse.reduce(
        (acc, res) => {
          acc[res.data.id] = res.data
          return acc
        },
        {} as Record<string, Customer>,
      )

      const servicesMap = servicesResponse.reduce(
        (acc, res) => {
          acc[res.data.id] = res.data
          return acc
        },
        {} as Record<string, Service>,
      )

      setAppointments(appointments)
      setCustomers(customersMap)
      setServices(servicesMap)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải lịch hẹn",
        description: axiosError.response?.data?.message || "Không thể tải lịch hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptClick = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      onAcceptModalOpen()
    }
  }
  const handleViewAppointment = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      onOpen()
    }
  }
  const handleAcceptAppointment = async (notes: string) => {
    if (!selectedAppointment) return

    setIsAccepting(true)
    try {
      await appointmentsApi.updateAppointmentStatus(selectedAppointment.id, {
        status: AppointmentStatus.Confirmed,
        notes,
      })
      toast({
        title: "Đã chấp nhận lịch hẹn",
        status: "success",
        duration: 3000,
      })
      onAcceptModalClose()
      loadAppointments()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi chấp nhận lịch hẹn", 
        description: axiosError.response?.data?.message || "Không thể chấp nhận lịch hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsAccepting(false)
      setSelectedAppointment(null)
    }
  }

  const handleCancelClick = (appointmentId: string) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId)
    if (appointment) {
      setSelectedAppointment(appointment)
      onCancelModalOpen()
    }
  }
  useMemo(() => {
    let filtered = appointments

    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((apt) => {
        const service = services[apt.serviceId]
        const customer = `${apt.customerId}`.toLowerCase()
        return service?.name.toLowerCase().includes(query) || customer.includes(query)
      })
    }

    return filtered
  }, [searchQuery, statusFilter])

  // Handle appointment status updates
  const handleStatusUpdate = async (appointmentId: string, status: AppointmentStatus, notes?: string) => {
    try {
      await appointmentsApi.updateAppointmentStatus(appointmentId, {
        status,
        notes,
      })

      toast({
        title: "Đã cập nhật trạng thái",
        status: "success",
        duration: 3000,
      })

      // Reload appointments to get latest data
      loadAppointments()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi cập nhật trạng thái",
        description: axiosError.response?.data?.message || "Không thể cập nhật trạng thái",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleCompleteAppointment = async (appointmentId: string) => {
    await handleStatusUpdate(appointmentId, AppointmentStatus.Completed)
  }

  const handleNoShow = async (appointmentId: string) => {
    await handleStatusUpdate(appointmentId, AppointmentStatus.NoShow)
  }

  const handleCancelAppointment = async (reason: string) => {
    if (!selectedAppointment) return
  
    setIsCancelling(true)
    try {
      await appointmentsApi.updateAppointmentStatus(selectedAppointment.id, {
        status: AppointmentStatus.Cancelled,
        notes: reason,
      })
      toast({
        title: "Đã hủy lịch hẹn",
        status: "success", 
        duration: 3000,
      })
      onCancelModalClose()
      loadAppointments()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi hủy lịch hẹn",
        description: axiosError.response?.data?.message || "Không thể hủy lịch hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsCancelling(false)
      setSelectedAppointment(null)
    }
  }

  // Update filtered appointments to use real data
  const filteredAppointments = useMemo(() => {
    let filtered = appointments
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((apt) => {
        const customer = `${apt.customerId}`.toLowerCase()
        return customer.includes(query)
      })
    }
    return filtered
  }, [appointments, searchQuery, statusFilter])

  if (isLoading) {
    return <Spinner size="xl" />
  }

  return (
    <Stack spacing={6}>
      <Card>
        <CardBody>
          <Stack spacing={4}>
            {/* Filters */}
            <HStack spacing={4}>
              <InputGroup maxW="xs">
                <InputLeftElement pointerEvents="none">
                  <Search size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Tìm kiếm lịch hẹn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Select maxW="xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value={AppointmentStatus.Pending}>Đang chờ</option>
                <option value={AppointmentStatus.Confirmed}>Đã xác nhận</option>
                <option value={AppointmentStatus.Completed}>Đã hoàn thành</option>
                <option value={AppointmentStatus.Cancelled}>Đã hủy</option>
                <option value={AppointmentStatus.NoShow}>Không đến</option>
              </Select>
            </HStack>

            {/* Appointments Table */}
            <Box overflowX="auto">
              <Table variant="simple" w="full">
                <Thead>
                  <Tr>
                    <Th>Ngày & Giờ</Th>
                    <Th>Khách hàng</Th>
                    <Th>Dịch vụ</Th>
                    <Th>Giá</Th>
                    <Th>Trạng thái</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredAppointments.map((appointment) => {
                    const service = services[appointment.serviceId]
                    const customer = customers[appointment.customerId]
                    return (
                      <Tr key={appointment.id}>
                        <Td>
                          <Box fontSize="sm">
                            <Box>{formatTime(appointment.dateTime)}</Box>
                            <Box>{formatDate(appointment.dateTime)}</Box>
                          </Box>
                        </Td>
                        <Td>
                          <Text>{customer ? `${customer.firstName} ${customer.lastName}` : "Loading..."}</Text>
                        </Td>
                        <Td>{service?.name}</Td>
                        <Td>{formatPrice(appointment.totalPrice)}</Td>
                        <Td>
                          <Text
                            px={3}
                            py={1}
                            rounded="full"
                            fontSize="sm"
                            fontWeight="medium"
                            textTransform="capitalize"
                            bg={getStatusColor(appointment.status)}
                            display="inline-block"
                          >
                            {appointment.status}
                          </Text>
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton as={IconButton} variant="ghost" size="sm" icon={<MoreVertical size={16} />} />
                            <MenuList>
                              <MenuItem icon={<Eye size={16} />} onClick={() => handleViewAppointment(appointment.id)}>
                                Xem chi tiết
                              </MenuItem>
                              {appointment.status === AppointmentStatus.Pending && (
                                <MenuItem
                                  icon={<ThumbsUp size={16} />}
                                  onClick={() => handleAcceptClick(appointment.id)}
                                  color="blue.500"
                                >
                                  Chấp nhận lịch hẹn
                                </MenuItem>
                              )}
                              {appointment.status === AppointmentStatus.Confirmed && (
                                <>
                                  <MenuItem
                                    icon={<Check size={16} />}
                                    onClick={() => handleCompleteAppointment(appointment.id)}
                                    color="green.500"
                                  >
                                    Đánh dấu hoàn thành
                                  </MenuItem>
                                  <MenuItem
                                    icon={<X size={16} />}
                                    onClick={() => handleNoShow(appointment.id)}
                                    color="orange.500"
                                  >
                                    Đánh dấu không đến
                                  </MenuItem>
                                </>
                              )}
                              {(appointment.status === AppointmentStatus.Pending ||
                                appointment.status === AppointmentStatus.Confirmed) && (
                                <MenuItem
                                  icon={<X size={16} />}
                                  onClick={() => handleCancelClick(appointment.id)}
                                  color="red.500"
                                >
                                  Hủy lịch hẹn
                                </MenuItem>
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </Box>
          </Stack>
        </CardBody>
      </Card>

      {/* Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          isOpen={isOpen}
          onClose={() => {
            onClose()
            setSelectedAppointment(null)
          }}
          onComplete={handleCompleteAppointment}
          onCancel={handleCancelClick}
        />
      )}

      {/* Cancel Appointment Modal */}
      <AppointmentCancelModal
        appointment={selectedAppointment}
        isOpen={isCancelModalOpen}
        onClose={onCancelModalClose}
        onConfirm={handleCancelAppointment}
        isLoading={isCancelling}
      />

      {/* Accept Appointment Modal */}
      <AppointmentAcceptModal
        appointment={selectedAppointment}
        isOpen={isAcceptModalOpen}
        onClose={onAcceptModalClose}
        onConfirm={handleAcceptAppointment}
        isLoading={isAccepting}
      />
    </Stack>
  )
}

function getStatusColor(status: AppointmentStatus): string {
  switch (status) {
    case AppointmentStatus.Pending:
      return "yellow.100"
    case AppointmentStatus.Confirmed:
      return "blue.100"
    case AppointmentStatus.Completed:
      return "green.100"
    case AppointmentStatus.Cancelled:
      return "red.100"
    case AppointmentStatus.NoShow:
      return "orange.100"
    default:
      return "gray.100"
  }
}

export default AppointmentList
