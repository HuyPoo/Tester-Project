import { useEffect, useState } from "react"
import { Spinner, useToast, VStack } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Service } from "@/types/services"
import ServiceGrid from "@/components/services/ServiceGrid"
import { servicesApi } from "@/api/services"
import { stylistsApi } from "@/api/stylists.ts"

interface ServiceSelectionProps {
  onSelect: (service: Service) => void
  stylistId?: string
}

function ServiceSelection({ onSelect, stylistId }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadServices()
  }, [stylistId])

  const loadServices = async () => {
    try {
      let response
      if (stylistId) {
        // Get services for specific stylist
        response = await stylistsApi.getStylistServices(stylistId)
      } else {
        // Get all services
        response = await servicesApi.getServices()
      }
      setServices(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải dịch vụ",
        description: axiosError.response?.data?.message || "Không thể tải dịch vụ",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <VStack spacing={6} width="100%" justify="center" py={8}>
        <Spinner size="xl" />
      </VStack>
    )
  }

  return (
    <VStack spacing={6} width="100%">
      <ServiceGrid services={services} onClick={onSelect} />
    </VStack>
  )
}

export default ServiceSelection
