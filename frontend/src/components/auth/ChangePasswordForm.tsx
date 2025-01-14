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

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(32, "Mật khẩu không được vượt quá 32 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

interface ChangePasswordFormProps {
  onSubmit: (data: Omit<ChangePasswordFormData, "confirmPassword">) => void
  isLoading?: boolean
}

function ChangePasswordForm({ onSubmit, isLoading = false }: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  })

  const inputBg = useColorModeValue("white", "gray.800")

  const handleFormSubmit = (data: ChangePasswordFormData) => {
    const { confirmPassword, ...submitData } = data
    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ width: "100%" }}>
      <Stack spacing={4}>
        <FormControl isInvalid={!!errors.currentPassword}>
          <FormLabel>Mật khẩu hiện tại</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu hiện tại"
              bg={inputBg}
              {...register("currentPassword")}
            />
            <InputRightElement>
              <Button variant="ghost" size="sm" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Icon as={showCurrentPassword ? EyeOff : Eye} color="gray.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.newPassword}>
          <FormLabel>Mật khẩu mới</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              bg={inputBg}
              {...register("newPassword")}
            />
            <InputRightElement>
              <Button variant="ghost" size="sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                <Icon as={showNewPassword ? EyeOff : Eye} color="gray.500" />
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <Icon as={Lock} color="gray.500" />
            </InputLeftElement>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu mới"
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
          Cập nhật mật khẩu
        </Button>
      </Stack>
    </form>
  )
}

export default ChangePasswordForm
