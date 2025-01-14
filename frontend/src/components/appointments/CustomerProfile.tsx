import {
  Avatar,
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { Customer } from "@/types/customers.ts"

interface CustomerProfileProps {
  profile: Customer
  onUpdate: (profile: Customer) => void
}

function CustomerProfile({ profile, onUpdate }: CustomerProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const toast = useToast()

  const handleSave = () => {
    onUpdate(formData)
    setIsEditing(false)
    toast({
      title: "Hồ sơ đã cập nhật",
      status: "success",
      duration: 3000,
    })
  }

  return (
    <Card>
      <CardBody>
        <VStack spacing={6} align="stretch">
          <HStack spacing={4}>
            <Avatar size="xl" name={`${profile.firstName} ${profile.lastName}`} />
            <VStack align="start" spacing={1}>
              <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </VStack>
          </HStack>

          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Tên</FormLabel>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                isReadOnly={!isEditing}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Họ</FormLabel>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                isReadOnly={!isEditing}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                isReadOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel>Số diên thoại</FormLabel>
              <Input
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                isReadOnly={!isEditing}
              />
            </FormControl>

            {isEditing && (
              <Button colorScheme="blue" onClick={handleSave}>
                Lưu thay đổi
              </Button>
            )}
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default CustomerProfile
