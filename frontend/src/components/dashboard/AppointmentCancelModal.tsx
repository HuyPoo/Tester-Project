import {
  Badge,
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react"
import { Appointment } from "@/types/appointments"
import { formatDate, formatTime } from "@/utils/formats"
import { useState } from "react"

interface CancelAppointmentModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  isLoading?: boolean
}

export function AppointmentCancelModal({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: CancelAppointmentModalProps) {
  const [reason, setReason] = useState("")

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hủy Lịch Hẹn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>Bạn có chắc chắn muốn hủy lịch hẹn này? Hành động này không thể hoàn tác.</Text>
            <Box>
              <Text mb={2} fontWeight="medium">
                Chi Tiết Lịch Hẹn:
              </Text>
              <HStack spacing={4}>
                <Text color="gray.600">{appointment && formatDate(appointment.dateTime)}</Text>
                {appointment && <Badge colorScheme="blue">{formatTime(appointment.dateTime)}</Badge>}
              </HStack>
            </Box>
            <FormControl isRequired>
              <FormLabel>Lý Do Hủy Lịch</FormLabel>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Vui lòng cung cấp lý do hủy lịch"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Giữ Lịch Hẹn
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(reason)} isLoading={isLoading} isDisabled={!reason.trim()}>
            Hủy Lịch Hẹn
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
