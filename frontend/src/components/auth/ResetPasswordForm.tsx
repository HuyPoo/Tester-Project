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
import { Eye, EyeOff, Lock } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(32, "Mật khẩu không được vượt quá 32 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

interface ResetPasswordFormProps {
  onSubmit: (data: { password: string }) => void
  isLoading?: boolean
}

function ResetPasswordForm({ onSubmit, isLoading = false }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const inputBg = useColorModeValue("white", "gray.800")

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    const { confirmPassword, ...submitData } = data
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: "100%" }}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>Mật khẩu mới</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới của bạn"
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

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>Xác nhận mật khẩu</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới của bạn"
              bg={inputBg}
              {...register("confirmPassword")}
            />
            <InputRightElement>
              <Button variant="ghost" size="sm" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Icon as={showConfirmPassword ? EyeOff : Eye} color="gray.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <Button type="submit" colorScheme="blue" size="lg" fontSize="md" isLoading={isLoading}>
          Thay đổi mật khẩu
        </Button>
      </Stack>
    </form>
  )
}

export default ResetPasswordForm
