import { useEffect, useState } from "react"
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Appointment, AppointmentStatus } from "@/types/appointments"
import { Service } from "@/types/services"
import { Stylist } from "@/types/stylists"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"
import { appointmentsApi } from "@/api/appointments"
import { servicesApi } from "@/api/services"
import { stylistsApi } from "@/api/stylists"

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
  onCancelled?: () => void
}

function UpcomingAppointments({ appointments, onCancelled }: UpcomingAppointmentsProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stylists, setStylists] = useState<Record<string, Stylist>>({})
  const [services, setServices] = useState<Record<string, Service>>({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    loadServicesAndStylists()
  }, [appointments])

  const loadServicesAndStylists = async () => {
    try {
      const uniqueServiceIds = [...new Set(appointments.map((apt) => apt.serviceId))]
      const uniqueStylistIds = [...new Set(appointments.map((apt) => apt.stylistId))]

      const [servicesResponse, stylistsResponse] = await Promise.all([
        Promise.all(uniqueServiceIds.map((id) => servicesApi.getService(id))),
        Promise.all(uniqueStylistIds.map((id) => stylistsApi.getStylist(id))),
      ])

      const servicesMap = servicesResponse.reduce(
        (acc, response) => {
          acc[response.data.id] = response.data
          return acc
        },
        {} as Record<string, Service>,
      )

      const stylistsMap = stylistsResponse.reduce(
        (acc, response) => {
          acc[response.data.id] = response.data
          return acc
        },
        {} as Record<string, Stylist>,
      )

      setServices(servicesMap)
      setStylists(stylistsMap)
    } catch (error) {
      toast({
        title: "Lỗi tải thông tin",
        description: "Không thể tải thông tin dịch vụ và stylist",
        status: "error",
        duration: 3000,
      })
    }
  }

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    onOpen()
  }

  const handleCancelConfirm = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cung cấp lý do hủy lịch",
        status: "error",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      await appointmentsApi.cancelAppointment(selectedAppointment.id, cancelReason)

      toast({
        title: "Đã hủy lịch hẹn",
        status: "success",
        duration: 3000,
      })

      onClose()
      setCancelReason("")
      setSelectedAppointment(null)
      onCancelled?.()
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Hủy lịch thất bại",
        description: axiosError.response?.data?.message || "Không thể hủy lịch hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <VStack spacing={4} align="stretch">
        {appointments.map((appointment) => {
          const stylist = stylists[appointment.stylistId]
          const service = services[appointment.serviceId]

          return (
            <Card key={appointment.id}>
              <CardBody>
                <HStack spacing={6} align="start">
                  <Avatar
                    size="lg"
                    name={stylist ? `${stylist.firstName} ${stylist.lastName}` : undefined}
                    src={stylist?.imageUrl}
                  />
                  <Box flex={1}>
                    <HStack justify="space-between" mb={2}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {service?.name || "Đang tải..."}
                        </Text>
                        <Text>với {stylist ? `${stylist.firstName} ${stylist.lastName}` : "Đang tải..."}</Text>
                        <Text>
                          {formatTime(appointment.dateTime)} - {formatDate(appointment.dateTime)}
                        </Text>
                        <Badge colorScheme={appointment.status === AppointmentStatus.Confirmed ? "green" : "yellow"}>
                          {appointment.status}
                        </Badge>
                      </VStack>
                      <VStack align="end" spacing={2}>
                        <Text fontWeight="bold" fontSize="lg">
                          {formatPrice(appointment.totalPrice)}
                        </Text>
                        <Button size="sm" colorScheme="red" onClick={() => handleCancelClick(appointment)}>
                          Hủy
                        </Button>
                      </VStack>
                    </HStack>
                    {appointment.customerNotes && (
                      <Text fontSize="sm" color="gray.500">
                        Ghi chú: {appointment.customerNotes}
                      </Text>
                    )}
                    {appointment.stylistNotes && (
                      <Text fontSize="sm" color="gray.500">
                        Ghi chú của stylist:{appointment.stylistNotes}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </CardBody>
            </Card>
          )
        })}
      </VStack>

      {/* Cancel Appointment Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Hủy Lịch Hẹn</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text>Bạn có chắc chắn muốn hủy lịch hẹn này?</Text>
              <FormControl isRequired>
                <FormLabel>Lý do hủy lịch</FormLabel>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng cung cấp lý do"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
              Giữ Lịch Hẹn
            </Button>
            <Button colorScheme="red" onClick={handleCancelConfirm} isLoading={isLoading}>
              Hủy Lịch Hẹn
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpcomingAppointments
