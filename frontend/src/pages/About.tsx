import { Badge, Box, Container, Heading, Spinner, Text, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { Users } from "lucide-react"
import ContactSection from "@/components/contact/ContactSection.tsx"
import Layout from "@/components/Layout.tsx"
import StylistGrid from "@/components/stylists/StylistGrid.tsx"
import { useEffect, useState } from "react"
import { Stylist } from "@/types/stylists"
import { stylistsApi } from "@/api/stylists"

const AboutPage = () => {
  const [stylists, setStylists] = useState<Stylist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const textColor = useColorModeValue("gray.600", "gray.400")

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      const stylistsResponse = await stylistsApi.getStylists()
      setStylists(stylistsResponse.data)
    } catch (error) {
      toast({
        title: "Lỗi tải trang",
        description: "Không thể tải thông tin trang giới thiệu",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="7xl" py={20}>
          <VStack>
            <Spinner size="xl" />
          </VStack>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box minH="100vh" py={20}>
        <Container maxW="7xl">
          <VStack spacing={16}>
            {/* About Section */}
            <VStack spacing={6} textAlign="center" maxW="3xl" mx="auto">
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" display="flex" alignItems="center">
                <Users size={14} style={{ marginRight: "6px" }} />
                Câu chuyện của chúng tôi
              </Badge>

              <Heading size="2xl">About Our Salon</Heading>

              <Text fontSize="lg" color={textColor}>
                Chúng tôi tự hào mang đến những dịch vụ làm đẹp chất lượng cao với đội ngũ stylist chuyên nghiệp, 
                được đào tạo bài bản. Với nhiều năm kinh nghiệm trong ngành, chúng tôi cam kết mang đến trải nghiệm 
                tuyệt vời và sự hài lòng cho mọi khách hàng.
              </Text>

              <Text fontSize="lg" color={textColor}>
                Salon của chúng tôi không chỉ là nơi làm đẹp, mà còn là không gian thư giãn sang trọng, 
                nơi bạn có thể tạm gác lại những bộn bề cuộc sống để chăm sóc bản thân. Chúng tôi luôn 
                cập nhật những xu hướng mới nhất để đảm bảo mang đến cho khách hàng những trải nghiệm tốt nhất.
              </Text>
            </VStack>

            {/* Team Section */}
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading size="xl">Meet Our Team</Heading>
                <Text fontSize="lg" color={textColor} maxW="2xl">
                  Đội ngũ chuyên gia tài năng của chúng tôi luôn sẵn sàng giúp bạn có vẻ ngoài và cảm giác tuyệt vời nhất.
                </Text>
              </VStack>

              <StylistGrid stylists={stylists} lg={4} />
            </VStack>
          </VStack>
        </Container>
        <ContactSection />
      </Box>
    </Layout>
  )
}

export default AboutPage
