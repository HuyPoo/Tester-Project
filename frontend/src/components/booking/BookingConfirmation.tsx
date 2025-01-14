import {
  Box,
  Button,
  Divider,
  Heading,
  HStack,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"
import { useState } from "react"
import { BookingData } from "@/types/appointments.ts"

interface BookingConfirmationProps {
  bookingData: BookingData
  onConfirm: (notes: string) => void
  onBack: () => void
  isLoading?: boolean
}

function BookingConfirmation({ bookingData, onConfirm, onBack, isLoading = false }: BookingConfirmationProps) {
  const [notes, setNotes] = useState("")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  return (
    <VStack spacing={6} width="100%" maxW="xl" mx="auto">
      <Box width="100%" p={6} borderWidth="1px" borderRadius="lg" borderColor={borderColor}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Thông tin đặt lịch</Heading>
          <Divider />

          {/* Service Details */}
          <Stack spacing={2}>
            <Text fontWeight="bold">Dịch vụ</Text>
            <HStack justify="space-between">
              <Text>{bookingData.service?.name}</Text>
              <Text>{formatPrice(bookingData.service?.price || 0)}</Text>
            </HStack>
          </Stack>

          {/* Stylist Details */}
          <Stack spacing={2}>
            <Text fontWeight="bold">Nhà tạo mẫu</Text>
            <Text>
              {bookingData.stylist?.firstName} {bookingData.stylist?.lastName}
            </Text>
          </Stack>

          {/* Date & Time */}
          <Stack spacing={2}>
            <Text fontWeight="bold">Ngày & Giờ</Text>
            <Text>
              {bookingData.dateTime && `${formatDate(bookingData.dateTime)} at ${formatTime(bookingData.dateTime)}`}
            </Text>
          </Stack>

          {/* Notes */}
          <Stack spacing={2}>
            <Text fontWeight="bold">Thêm ghi chú</Text>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bạn có yêu cầu hoặc ghi chú đặc biệt nào cho stylist không?"
              rows={4}
            />
          </Stack>
        </VStack>
      </Box>

      <HStack spacing={4} width="100%">
        <Button variant="outline" onClick={onBack} isDisabled={isLoading}>
          Back
        </Button>
        <Button colorScheme="blue" onClick={() => onConfirm(notes)} isLoading={isLoading}>
          Confirm Booking
        </Button>
      </HStack>
    </VStack>
  )
}

export default BookingConfirmation
