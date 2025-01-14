import { Avatar, Badge, Box, Card, CardBody, HStack, Spinner, Text, useToast, VStack } from "@chakra-ui/react"
import { Appointment, AppointmentStatus } from "@/types/appointments"
import { formatDate, formatPrice, formatTime } from "@/utils/formats"
import { useEffect, useState } from "react"
import { Stylist } from "@/types/stylists.ts"
import { Service } from "@/types/services.ts"
import { servicesApi } from "@/api/services"
import { stylistsApi } from "@/api/stylists.ts"

interface AppointmentHistoryProps {
  appointments: Appointment[]
}

function AppointmentHistory({ appointments }: AppointmentHistoryProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stylists, setStylists] = useState<Record<string, Stylist>>({})
  const [services, setServices] = useState<Record<string, Service>>({})
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

      const servicesData = servicesResponse.reduce(
        (acc, res) => {
          acc[res.data.id] = res.data
          return acc
        },
        {} as Record<string, Service>,
      )

      const stylistsData = stylistsResponse.reduce(
        (acc, res) => {
          acc[res.data.id] = res.data
          return acc
        },
        {} as Record<string, Stylist>,
      )

      setServices(servicesData)
      setStylists(stylistsData)
      setIsLoading(false)
    } catch (error) {
      toast({
        title: "Lỗi tải dịch vụ và stylist",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
    }
  }

  if (isLoading) {
    return <Spinner size="xl" />
  }

  return (
    <VStack spacing={4} align="stretch">
      {appointments.map((appointment) => (
        <Card key={appointment.id}>
          <CardBody>
            <HStack spacing={6} align="start">
              <Avatar
                size="lg"
                name={`${stylists[appointment.stylistId].firstName} ${stylists[appointment.stylistId].lastName}`}
                src={stylists[appointment.stylistId].imageUrl}
              />
              <Box flex={1}>
                <HStack justify="space-between" mb={2}>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{services[appointment.serviceId].name}</Text>
                    <Text>
                      with {stylists[appointment.stylistId].firstName} {stylists[appointment.stylistId].lastName}
                    </Text>
                    <Text>
                      {formatTime(appointment.dateTime)} - {formatDate(appointment.dateTime)}
                    </Text>
                    <Badge
                      colorScheme={
                        appointment.status === AppointmentStatus.Completed
                          ? "green"
                          : appointment.status === AppointmentStatus.Cancelled
                            ? "red"
                            : "yellow"
                      }
                    >
                      {appointment.status}
                    </Badge>
                  </VStack>
                  <Text fontWeight="bold">{formatPrice(appointment.totalPrice)}</Text>
                </HStack>
              </Box>
            </HStack>
          </CardBody>
        </Card>
      ))}
    </VStack>
  )
}

export default AppointmentHistory
