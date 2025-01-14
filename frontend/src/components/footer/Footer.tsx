import {
  Box,
  Container,
  Divider,
  HStack,
  Link,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { Clock, Heart, Mail, MapPin, Phone } from "lucide-react"
import SocialLinks from "@/components/footer/SocialLinks.tsx"
import { useEffect, useState } from "react"
import { salonApi, SalonSettings } from "@/api/salon.ts"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const textColor = useColorModeValue("gray.600", "gray.400")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const [salon, setSalon] = useState<SalonSettings | null>(null)
  const toast = useToast()

  const boxBg = useColorModeValue("white", "gray.900")
  const text2Color = useColorModeValue("blue.500", "blue.300")

  useEffect(() => {
    loadSalonSettings()
  }, [])

  const loadSalonSettings = async () => {
    try {
      const salonResponse = await salonApi.getSalon()
      setSalon(salonResponse.data)
    } catch (error) {
      toast({
        title: "Lỗi tải cài đặt salon",
        description: "Không thể tải cài đặt salon",
        status: "error",
        duration: 3000,
      })
    }
  }

  const QUICK_LINKS = [
    { label: "Về Chúng Tôi", href: "/about" },
    { label: "Dịch Vụ", href: "/services" },
    { label: "Đặt Lịch", href: "/book" },
  ]

  if (!salon) {
    return <Spinner size="xl" />
  }

  return (
    <Box as="footer" bg={boxBg} color={textColor} borderTop={1} borderStyle={"solid"} borderColor={borderColor}>
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid templateColumns={{ sm: "1fr 1fr", md: "2fr 1fr 1fr 2fr" }} spacing={8}>
          {/* Company Info */}
          <Stack spacing={6}>
            <Box>
              <Text fontSize={"2xl"} fontWeight={"bold"} color={text2Color}>
                {salon.name}
              </Text>
              <Text fontSize={"sm"} mt={2}>
                {salon.description}
              </Text>
            </Box>
            <SocialLinks />
          </Stack>

          {/* Quick Links */}
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Liên kết nhanh
            </Text>
            {QUICK_LINKS.map((link) => (
              <Link key={link.label} href={link.href} color={textColor} _hover={{ color: "blue.500" }}>
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Business Hours */}
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Business Hours
            </Text>
            <VStack align={"flex-start"} spacing={0} fontSize={"sm"}>
              <Text fontWeight={"500"}>Thứ hai - Chủ nhât</Text>
              <HStack spacing={2}>
                <Clock size={14} />
                <Text>
                  {salon.openingTime} - {salon.closingTime}
                </Text>
              </HStack>
            </VStack>
          </Stack>

          {/* Contact Info */}
          <Stack align={"flex-start"}>
            <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
              Contact Us
            </Text>
            <VStack align={"flex-start"} spacing={3}>
              <HStack>
                <MapPin size={18} />
                <Text fontSize={"sm"}>{salon.address}</Text>
              </HStack>
              <HStack>
                <Phone size={18} />
                <Link href={`tel:${salon.phoneNumber}`} fontSize={"sm"}>
                  {salon.phoneNumber}
                </Link>
              </HStack>
              <HStack>
                <Mail size={18} />
                <Link href={`mailto:${salon.email}`} fontSize={"sm"}>
                  {salon.email}
                </Link>
              </HStack>
            </VStack>
          </Stack>
        </SimpleGrid>

        <Divider my={6} borderColor={borderColor} />

        {/* Copyright */}
        <HStack direction={"row"} spacing={6} justify={"center"} fontSize={"sm"} color={textColor}>
          <Text>© {currentYear} Virgo 14. All rights reserved.</Text>
          <Text>
            Made with <Heart size={14} style={{ display: "inline" }} /> by Virgo 14 Dev Team
          </Text>
        </HStack>
      </Container>
    </Box>
  )
}

export default Footer
