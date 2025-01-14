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
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự"),
  lastName: z
    .string()
    .min(2, "Họ phải có ít nhất 2 ký tự")
    .max(50, "Họ không được vượt quá 50 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(32, "Mật khẩu không được vượt quá 32 ký tự"),
  phoneNumber: z.string().regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?(-?\s?[0-9])+$/, "Số điện thoại không hợp lệ"),
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading?: boolean
}

function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const inputBg = useColorModeValue("white", "gray.800")

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.firstName}>
          <FormLabel>Tên</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={User} color="gray.500" />
            </InputLeftElement>
            <Input placeholder="Nhập vào tên của bạn" bg={inputBg} {...register("firstName")} />
          </InputGroup>
          <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.lastName}>
          <FormLabel>Họ</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={User} color="gray.500" />
            </InputLeftElement>
            <Input placeholder="Nhập vào Họ của bạn" bg={inputBg} {...register("lastName")} />
          </InputGroup>
          <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Mail} color="gray.500" />
            </InputLeftElement>
            <Input type="email" placeholder="Nhập vào địa chỉ email của bạn" bg={inputBg} {...register("email")} />
          </InputGroup>
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phoneNumber}>
          <FormLabel>Số điện thoại</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Phone} color="gray.500" />
            </InputLeftElement>
            <Input type="tel" placeholder="Nhập vào số điện thoại của bạn" bg={inputBg} {...register("phoneNumber")} />
          </InputGroup>
          <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Mật khẩu</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Tạo mật khẩu"
              bg={inputBg}
              {...register("password")}
            />
            <InputRightElement>
              <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                <Icon as={showPassword ? EyeOff : Eye} color="gray.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg" fontSize="md" isLoading={isLoading}>
          Tạo tài khoản
        </Button>
      </Stack>
    </form>
  )
}

export default RegisterForm
