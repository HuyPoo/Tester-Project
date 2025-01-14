import { useEffect, useState } from "react"
import { Button, Grid, Spinner, Text, useToast, VStack } from "@chakra-ui/react"
import { salonApi, SalonSettings } from "@/api/salon.ts"

interface DateSelectionProps {
  onSelect: (date: Date) => void
  stylistId?: string
  serviceId?: string
}

function DateSelection({ onSelect }: DateSelectionProps) {
  const [salonSettings, setSalonSettings] = useState<SalonSettings>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const toast = useToast()

  useEffect(() => {
    loadSalonSettings()
  }, [])

  const loadSalonSettings = async () => {
    try {
      const response = await salonApi.getSalon()
      setSalonSettings(response.data)
    } catch (error) {
      toast({
        title: "Lỗi tải cài đặt salon",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
    }
  }

  if (!salonSettings) {
    return <Spinner size="xl" />
  }

  const dates = getNextAvailableDates(salonSettings)
  return (
    <VStack spacing={6} width="100%">
      <Grid templateColumns="repeat(7, 1fr)" gap={4}>
        {dates.map((date, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectedDate(date)
              onSelect(date)
            }}
            colorScheme={selectedDate?.toDateString() === date.toDateString() ? "blue" : "gray"}
            variant="outline"
            height="100px"
            p={4}
          >
            <VStack spacing={1}>
              <Text fontSize="sm">{date.toLocaleDateString("en-US", { weekday: "short" })}</Text>
              <Text fontSize="lg" fontWeight="bold">
                {date.getDate()}
              </Text>
              <Text fontSize="sm">{date.toLocaleDateString("en-US", { month: "short" })}</Text>
            </VStack>
          </Button>
        ))}
      </Grid>
    </VStack>
  )
}

function getNextAvailableDates(salon: SalonSettings): Date[] {
  const dates: Date[] = []
  const today = new Date()

  for (let i = 1; i <= salon.leadWeeks * 7; i++) {
    const date = new Date()
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  return dates
}

export default DateSelection
