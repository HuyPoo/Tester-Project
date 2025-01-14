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

interface AppointmentAcceptModalProps {
  appointment: Appointment | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (notes: string) => Promise<void>
  isLoading?: boolean
}

export function AppointmentAcceptModal({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: AppointmentAcceptModalProps) {
  const [notes, setNotes] = useState("")

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Xác Nhận Lịch Hẹn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>Bạn có chắc chắn muốn xác nhận lịch hẹn này?</Text>
            <Box>
              <Text mb={2} fontWeight="medium">
                Chi Tiết Lịch Hẹn:
              </Text>
              <HStack spacing={4}>
                <Text color="gray.600">{appointment && formatDate(appointment.dateTime)}</Text>
                {appointment && <Badge colorScheme="blue">{formatTime(appointment.dateTime)}</Badge>}
              </HStack>
            </Box>
            <FormControl>
              <FormLabel>Ghi Chú Cho Khách Hàng (không bắt buộc)</FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Thêm hướng dẫn hoặc ghi chú đặc biệt cho khách hàng"
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            Hủy
          </Button>
          <Button colorScheme="blue" onClick={() => onConfirm(notes)} isLoading={isLoading}>
            Xác Nhận Lịch Hẹn
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
