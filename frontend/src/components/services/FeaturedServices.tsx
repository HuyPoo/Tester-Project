import { useEffect, useState } from "react"
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { CalendarCheck, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router"
import { Service } from "@/types/services"
import ServiceGrid from "@/components/services/ServiceGrid"
import { servicesApi } from "@/api/services"

const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  useEffect(() => {
    loadFeaturedServices()
  }, [])

  const loadFeaturedServices = async () => {
    try {
      const response = await servicesApi.getServices({ pageSize: 4 })
      setServices(response.data)
    } catch (error) {
      toast({
        title: "Lỗi tải dịch vụ",
        description: "Không thể tải các dịch vụ nổi bật",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToBooking = (service: Service) => {
    navigate("/book", { state: { selectedService: service } })
  }

  return (
    <Box py={20} bg={bgColor} borderTop="1px" borderBottom="1px" borderColor={borderColor}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          {/* Header Content */}
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full" display="flex" alignItems="center">
              <CalendarCheck size={14} style={{ marginRight: "6px" }} />
              Đặt lịch trực tuyến dễ dàng
            </Badge>
            <Heading size="2xl">Dịch vụ nổi bật của chúng tôi</Heading>
            <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")} maxW="2xl">
              Trải nghiệm các dịch vụ phổ biến nhất của chúng tôi được thực hiện bởi các chuyên gia tạo mẫu. Đặt lịch hẹn ngay hôm nay và thay đổi diện mạo của bạn.
            </Text>
          </VStack>

          {/* Services Grid */}
          {isLoading ? <Spinner size="xl" /> : <ServiceGrid lg={4} services={services} onClick={navigateToBooking} />}

          <Button size="lg" colorScheme="blue" rightIcon={<ChevronRight />} onClick={() => navigate("/services")}>
            Xem tất cả dịch vụ
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default FeaturedServices
