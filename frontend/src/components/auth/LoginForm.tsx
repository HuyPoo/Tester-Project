import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu nhiều nhất 8 ký tự"),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading?: boolean
}

function LoginForm({ onSubmit, isLoading = false }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const inputBg = useColorModeValue("white", "gray.800")

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Mail} color="gray.500" />
            </InputLeftElement>
            <Input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              bg={inputBg}
              {...register("email")}
              isDisabled={isLoading}
            />
          </InputGroup>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Mật khẩu</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu của bạn"
              bg={inputBg}
              {...register("password")}
              isDisabled={isLoading}
            />
            <InputRightElement>
              <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                <Icon as={showPassword ? EyeOff : Eye} color="gray.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          fontSize="md"
          isLoading={isLoading}
          loadingText="Đang đăng nhập..."
        >
          Đăng nhập
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm
