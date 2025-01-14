import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Appointment, AppointmentStatus } from "@/types/appointments"
import { Service } from "@/types/services"
import { Stylist } from "@/types/stylists"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"
import { servicesApi } from "@/api/services"
import { stylistsApi } from "@/api/stylists"
import { Customer } from "@/types/customers.ts"
import { customersApi } from "@/api/customers.ts"

interface AppointmentDetailsModalProps {
  appointment: Appointment
  isOpen: boolean
  onClose: () => void
  onComplete?: (id: string) => void
  onCancel?: (id: string) => void
}

export function AppointmentDetailsModal({
  appointment,
  isOpen,
  onClose,
  onComplete,
  onCancel,
}: AppointmentDetailsModalProps) {
  const [service, setService] = useState<Service>()
  const [stylist, setStylist] = useState<Stylist>()
  const [customer, setCustomer] = useState<Customer>()

  useEffect(() => {
    if (isOpen) {
      loadDetails()
    }
  }, [isOpen, appointment])

  const loadDetails = async () => {
    try {
      const [serviceResponse, stylistResponse, customerResponse] = await Promise.all([
        servicesApi.getService(appointment.serviceId),
        stylistsApi.getStylist(appointment.stylistId),
        customersApi.getCustomer(appointment.customerId),
      ])
      setService(serviceResponse.data)
      setStylist(stylistResponse.data)
      setCustomer(customerResponse.data)
    } catch (error) {
      console.error("Error loading details:", error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Chi Tiết Lịch Hẹn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Status Badge */}
            <Badge
              alignSelf="start"
              px={3}
              py={1}
              rounded="full"
              fontSize="sm"
              textTransform="capitalize"
              colorScheme={
                appointment.status === AppointmentStatus.Completed
                  ? "green"
                  : appointment.status === AppointmentStatus.Cancelled
                    ? "red"
                    : "blue"
              }
            >
              {appointment.status === AppointmentStatus.Completed 
                ? "Đã hoàn thành"
                : appointment.status === AppointmentStatus.Cancelled
                  ? "Đã hủy"
                  : "Đã xác nhận"}
            </Badge>
  
            {/* Date & Time */}
            <Box>
              <Text fontWeight="bold" mb={1}>
                Ngày & Giờ
              </Text>
              <Text>
                {formatDate(appointment.dateTime)} lúc {formatTime(appointment.dateTime)}
              </Text>
            </Box>
  
            <Divider />
  
            {/* Service Details */}
            {service && (
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Dịch Vụ
                </Text>
                <Text>{service.name}</Text>
                <Text color="gray.600" fontSize="sm">
                  {service.description}
                </Text>
                <HStack spacing={4} mt={2}>
                  <Text fontWeight="medium">{formatPrice(appointment.totalPrice)}</Text>
                  <Text color="gray.600">{service.durationMinutes} phút</Text>
                </HStack>
              </Box>
            )}
  
            <Divider />
  
            {/* Customer Details */}
            {customer && (
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Khách Hàng
                </Text>
                <HStack spacing={3}>
                  <Avatar size="sm" name={`${customer.firstName} ${customer.lastName}`} />
                  <VStack align="start" spacing={0}>
                    <Text>
                      {customer.firstName} {customer.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {customer.email}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
  
            {/* Stylist Details */}
            {stylist && (
              <Box>
                <Text fontWeight="bold" mb={1}>
                  Stylist
                </Text>
                <HStack spacing={3}>
                  <Avatar size="sm" name={`${stylist.firstName} ${stylist.lastName}`} src={stylist.imageUrl} />
                  <VStack align="start" spacing={0}>
                    <Text>
                      {stylist.firstName} {stylist.lastName}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {stylist.email}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
  
            <Divider />
  
            {/* Notes */}
            {(appointment.customerNotes || appointment.stylistNotes) && (
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Ghi Chú
                </Text>
                {appointment.customerNotes && (
                  <Box mb={2}>
                    <Text fontSize="sm" fontWeight="medium">
                      Ghi chú của khách hàng:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {appointment.customerNotes}
                    </Text>
                  </Box>
                )}
                {appointment.stylistNotes && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Ghi chú của stylist:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {appointment.stylistNotes}
                    </Text>
                  </Box>
                )}
              </Box>
            )}
          </VStack>
        </ModalBody>
  
        <ModalFooter>
          {appointment.status === AppointmentStatus.Confirmed && (
            <>
              <Button colorScheme="green" mr={3} onClick={() => onComplete?.(appointment.id)}>
                Đánh dấu hoàn thành
              </Button>
              <Button colorScheme="red" mr={3} onClick={() => onCancel?.(appointment.id)}>
                Hủy Lịch Hẹn
              </Button>
            </>
          )}
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
