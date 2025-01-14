import { useEffect, useState } from "react"
import { Button, Grid, Spinner, Text, useToast, VStack } from "@chakra-ui/react"
import { stylistsApi } from "@/api/stylists"
import { formatTime } from "@/utils/formats.ts"

interface TimeSelectionProps {
  onSelect: (dateTime: Date) => void
  date?: Date
  stylistId?: string
  serviceId?: string
}

type Slot = {
  dateTime: Date
  isAvailable: boolean
}

function TimeSelection({ onSelect, date, stylistId, serviceId }: TimeSelectionProps) {
  const [slots, setSlots] = useState<Slot[]>()
  const toast = useToast()

  useEffect(() => {
    loadServiceSlots()
  }, [])

  const loadServiceSlots = async () => {
    if (!date || !stylistId || !serviceId) {
      toast({
        title: "Lỗi tải khung giờ dịch vụ",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
      return
    }
    try {
      const dateOnly = date.toISOString().split("T")[0]
      const response = await stylistsApi.getStylistServiceSlots(stylistId, serviceId, dateOnly)
      setSlots(
        response.data.slots.map(({ item1, item2 }) => {
          return {
            dateTime: item1,
            isAvailable: item2,
          }
        }),
      )
    } catch (error) {
      toast({
        title: "Lỗi tải khung giờ dịch vụ",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
    }
  }

  if (!slots) {
    return <Spinner size="xl" />
  }

  return (
    <VStack spacing={6} width="100%">
      <Grid templateColumns="repeat(4, 1fr)" gap={4} width="100%">
        {slots.map(({ dateTime, isAvailable }, index) => (
          <Button
            key={index}
            onClick={() => {
              onSelect(dateTime)
            }}
            colorScheme={isAvailable ? "blue" : "gray"}
            variant="outline"
            p={4}
            height="auto"
            isDisabled={!isAvailable}
          >
            <Text fontSize="lg">{formatTime(dateTime)}</Text>
          </Button>
        ))}
      </Grid>
    </VStack>
  )
}

export default TimeSelection
