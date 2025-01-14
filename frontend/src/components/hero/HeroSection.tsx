import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react"
import { useNavigate } from "react-router"

const HeroSection = () => {
  const navigate = useNavigate()
  const bgOverlay = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(26, 32, 44, 0.8)")
  const highlightColor = useColorModeValue("blue.500", "blue.300")

  const handleBookAppointment = () => {
    navigate("/book")
  }

  return (
    <Box
      position="relative"
      height={{ base: "100vh", lg: "85vh" }}
      maxHeight="900px"
      minHeight="600px"
      width="100%"
      overflow="hidden"
    >
      {/* Background Image */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        filter="brightness(0.9)"
        _after={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: bgOverlay,
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Content */}
      <Container maxW="7xl" height="100%" position="relative" zIndex={1}>
        <Flex
          height="100%"
          direction="column"
          justifyContent="center"
          alignItems={{ base: "center", md: "flex-start" }}
          textAlign={{ base: "center", md: "left" }}
          pt={{ base: "20", md: "0" }}
        >
          <VStack spacing={6} align={{ base: "center", md: "flex-start" }} maxW={{ base: "100%", md: "60%" }}>
            {/* Highlight Badge */}
            <HStack bg={useColorModeValue("white", "gray.800")} rounded="full" px={4} py={2} spacing={2}>
              <Sparkles size={16} color={highlightColor} />
              <Text fontSize="sm" fontWeight="medium">
                Ưu đãi khách hàng mới: Giảm 20% cho lần đầu tiên
              </Text>
            </HStack>

            {/* Main Heading */}
            <Heading as="h1" size={{ base: "2xl", md: "3xl", lg: "3xl" }} fontWeight="bold" lineHeight="shorter">
              Thay đổi diện mạo của bạn với các nhà tạo mẫu chuyên nghiệp của chúng tôi
            </Heading>

            {/* Subheading */}
            <Text fontSize={{ base: "lg", md: "xl" }} color={useColorModeValue("gray.600", "gray.300")} maxW="xl">
            Trải nghiệm dịch vụ chăm sóc tóc cao cấp được thiết kế riêng cho phong cách độc đáo của bạn. Đặt lịch hẹn ngay hôm nay và để các chuyên gia của chúng tôi chăm sóc bạn.
            </Text>

            {/* Call to Action Section */}
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} w={{ base: "100%", sm: "auto" }} mt={4}>
              <Button
                size="lg"
                colorScheme="blue"
                rightIcon={<ArrowRight size={20} />}
                onClick={handleBookAppointment}
                width={{ base: "100%", sm: "auto" }}
              >
                Đặt lịch hẹn ngay
              </Button>

              {/* Quick Info */}
              <HStack
                spacing={6}
                divider={
                  <Text color="gray.400" mx={2}>
                    |
                  </Text>
                }
                display={{ base: "none", md: "flex" }}
              >
                <HStack spacing={2}>
                  <Clock size={20} />
                  <Text>Mở cửa hôm nay: 8AM - 5PM</Text>
                </HStack>
                <HStack spacing={2}>
                  <Calendar size={20} />
                  <Text>Lịch hẹn tiếp theo: Hôm nay</Text>
                </HStack>
              </HStack>
            </Stack>

            {/* Feature Badges */}
            <Stack direction={{ base: "column", sm: "row" }} spacing={4} mt={8} display={{ base: "none", md: "flex" }}>
              {["Đội ngũ stylist chuyên nghiệp", "Sản phẩm cao cấp", "Trang thiết bị hiện đại"].map((feature) => (
                <Badge key={feature} px={3} py={1} colorScheme="gray" variant="subtle" rounded="full" fontSize="sm">
                  {feature}
                </Badge>
              ))}
            </Stack>
          </VStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default HeroSection
