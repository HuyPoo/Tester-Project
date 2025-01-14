import { useEffect, useState } from "react"
import { Badge, Box, Container, Heading, Spinner, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { Scissors } from "lucide-react"
import { useNavigate } from "react-router"
import SearchBar from "@/components/services/SearchBar"
import ServiceGrid from "@/components/services/ServiceGrid"
import Layout from "@/components/Layout"
import { servicesApi } from "@/api/services"
import { Service } from "@/types/services"

function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await servicesApi.getServices()
      setServices(response.data)
    } catch (error) {
      toast({
        title: "Lỗi tải dịch vụ",
        description: "Không thể tải danh sách dịch vụ",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const navigateToBooking = (service: Service) => {
    navigate("/book", { state: { selectedService: service } })
  }

  return (
    <Layout>
      <Box minH="100vh" py={20}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            {/* Header Section */}
            <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" display="flex" alignItems="center">
                <Scissors size={14} style={{ marginRight: "6px" }} />
                Dịch Vụ Của Chúng Tôi
              </Badge>
              <Heading size="2xl">Dịch Vụ Làm Tóc Chuyên Nghiệp</Heading>
              <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")}>
                Khám phá các dịch vụ làm tóc chuyên nghiệp được thiết kế để giúp bạn trông đẹp và cảm thấy tự tin nhất.
              </Text>
            </VStack>

            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            {isLoading ? (
              <Spinner size="xl" />
            ) : (
              <ServiceGrid services={filteredServices} onClick={navigateToBooking} />
            )}
          </VStack>
        </Container>
      </Box>
    </Layout>
  )
}

export default ServicesPage
