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
import { ChevronRight, Users } from "lucide-react"
import { useNavigate } from "react-router"
import StylistGrid from "@/components/stylists/StylistGrid"
import { stylistsApi } from "@/api/stylists"
import { Stylist } from "@/types/stylists"

const FeaturedStylists = () => {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()
  const bgColor = useColorModeValue("gray.50", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  useEffect(() => {
    loadFeaturedStylists()
  }, [])

  const loadFeaturedStylists = async () => {
    try {
      const response = await stylistsApi.getFeaturedStylists()
      setStylists(response.data)
    } catch (error) {
      toast({
        title: "Error loading stylists",
        description: "Could not load featured stylists",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box py={20} bg={bgColor} borderBottom="1px" borderColor={borderColor}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full" display="flex" alignItems="center">
              <Users size={14} style={{ marginRight: "6px" }} />
                Đội ngũ chuyên gia
            </Badge>

            <Heading size="2xl">Gặp gỡ đội ngũ tài năng của chúng tôi</Heading>

            <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")} maxW="2xl">
              Các nhà tạo mẫu chuyên nghiệp của chúng tôi luôn đam mê tạo kiểu phù hợp nhất cho bạn. Đặt lịch với một trong những chuyên gia của chúng tôi ngay hôm nay.
            </Text>
          </VStack>

          {/* Stylists Grid */}
          {isLoading ? <Spinner size="xl" /> : <StylistGrid stylists={stylists} />}

          {/* Call to Action */}
          <Button size="lg" colorScheme="blue" rightIcon={<ChevronRight />} onClick={() => navigate("/about")}>
            Xem tất cả nhà tạo mẫu
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}

export default FeaturedStylists
