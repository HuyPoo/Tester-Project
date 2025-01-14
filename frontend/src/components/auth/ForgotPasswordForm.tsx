import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void
  isLoading?: boolean
  emailSent?: boolean
}

function ForgotPasswordForm({ onSubmit, isLoading = false, emailSent = false }: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const inputBg = useColorModeValue("white", "gray.800")

  if (emailSent) {
    return (
      <VStack spacing={4}>
        <Text textAlign="center">
          Nếu tìm thấy tài khoản liên kết với địa chỉ email này, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
        </Text>
        <Text textAlign="center" fontSize="sm" color="gray.500">
          Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.
        </Text>
      </VStack>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Mail} color="gray.500" />
            </InputLeftElement>
            <Input type="email" placeholder="Enter your email" bg={inputBg} {...register("email")} />
          </InputGroup>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg" fontSize="md" isLoading={isLoading}>
          Gửi liên kết đặt lại mật khẩu
        </Button>
      </Stack>
    </form>
  )
}

export default ForgotPasswordForm
