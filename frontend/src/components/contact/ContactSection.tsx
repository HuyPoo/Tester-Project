// components/ContactSection.tsx
import {
  Badge,
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { MessageSquare, Send } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface ContactFormInputs {
  name: string
  email: string
  subject: string
  message: string
}

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ContactFormInputs>()

  const bgColor = useColorModeValue("gray.50", "gray.900")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const onSubmit = async (data: ContactFormInputs) => {
    setIsSubmitting(true)
    try {
      // Simulate Index call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Form data:", data)
      toast({
        title: "Đã gửi tin nhắn!",
        description: "Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
      reset()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box py={20} bg={bgColor} borderTop="1px" borderColor={borderColor}>
      <Container maxW="7xl">
        <VStack spacing={16}>
          {/* Section Header */}
          <VStack spacing={4} textAlign="center">
            <Badge colorScheme="blue" px={3} py={1} borderRadius="full" display="flex" alignItems="center">
              <MessageSquare size={14} style={{ marginRight: "6px" }} />
              Liên hệ
            </Badge>

            <Heading size="2xl">Liên hệ với chúng tôi</Heading>

            <Text fontSize="lg" color={useColorModeValue("gray.600", "gray.400")} maxW="2xl">
              Bạn có thắc mắc? Chúng tôi rất vui được lắng nghe từ bạn.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} width="100%">
            {/* Contact Form */}
            <VStack spacing={6} align="stretch">
              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4}>
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel>Họ và tên</FormLabel>
                    <Input
                      {...register("name", {
                        required: "Vui lòng nhập tên",
                        minLength: { value: 2, message: "Độ dài tối thiểu là 2 ký tự" },
                      })}
                    />
                    <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      {...register("email", {
                        required: "Vui lòng nhập email",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Địa chỉ email không hợp lệ",
                        },
                      })}
                    />
                    <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.subject}>
                    <FormLabel>Tiêu đề</FormLabel>
                    <Input
                      {...register("subject", {
                        required: "Vui lòng nhập tiêu đề",
                        minLength: { value: 4, message: "Độ dài tối thiểu là 4 ký tự" },
                      })}
                    />
                    <FormErrorMessage>{errors.subject && errors.subject.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.message}>
                    <FormLabel>Message</FormLabel>
                    <Textarea
                      {...register("message", {
                        required: "Vui lòng nhập nội dung",
                        minLength: { value: 10, message: "Độ dài tối thiểu là 10 ký tự" },
                      })}
                      rows={5}
                    />
                    <FormErrorMessage>{errors.message && errors.message.message}</FormErrorMessage>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    loadingText="Sending..."
                    type="submit"
                    width="100%"
                    leftIcon={<Send size={16} />}
                  >
                    Gửi tin nhắn
                  </Button>
                </VStack>
              </form>
            </VStack>

            {/* Map */}
            <Box borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor} height="100%" minH="400px">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                src="https://www.google.com/maps/embed/v1/search?q=Trường+Đại+Học+Giao+Thông+Vận+Tải+Thành+Phố+Hồ+Chí+Minh+(UTH)+-+Cơ+sở+3&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </Box>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

export default ContactSection
