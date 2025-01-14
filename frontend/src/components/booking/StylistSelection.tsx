import { useEffect, useState } from "react"
import { Spinner, useToast, VStack } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { Stylist } from "@/types/stylists"
import StylistGrid from "@/components/stylists/StylistGrid"
import { stylistsApi } from "@/api/stylists"
import { servicesApi } from "@/api/services.ts"

interface StylistSelectionProps {
  onSelect: (stylist: Stylist) => void
  serviceId?: string
}

function StylistSelection({ onSelect, serviceId }: StylistSelectionProps) {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadStylists()
  }, [serviceId])

  const loadStylists = async () => {
    try {
      let response
      if (serviceId) {
        // Get stylists for specific service
        response = await servicesApi.getServiceStylists(serviceId)
      } else {
        // Get all available stylists
        response = await stylistsApi.getStylists()
      }
      setStylists(response.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải stylist",
        description: axiosError.response?.data?.message || "Không thể tải danh sách stylist",
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
      <StylistGrid stylists={stylists} onClick={onSelect} disableDetails />
    </VStack>
  )
}

export default StylistSelection
