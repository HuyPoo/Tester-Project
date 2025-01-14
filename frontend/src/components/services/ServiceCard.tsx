import { Badge, Card, CardBody, Flex, Heading, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { LucideTimer } from "lucide-react"
import { Service } from "@/types/services.ts"
import { formatDuration, formatPrice } from "@/utils/formats.ts"

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const cardBg = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.600", "gray.200")
  const priceColor = useColorModeValue("blue.600", "blue.300")

  return (
    <Card
      maxW="sm"
      bg={cardBg}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "xl" }}
    >
      {service.imageUrl && (
        <Image src={service.imageUrl} alt={service.name} objectFit="cover" height="200px" width="100%" />
      )}

      <CardBody>
        <Stack spacing="4">
          <Heading size="md">{service.name}</Heading>
          <Text color={textColor}>{service.description}</Text>
          <Flex justify="space-between" align="center">
            <Text color={priceColor} fontSize="2xl" fontWeight="bold">
              {formatPrice(service.price)}
            </Text>
            <Badge display="flex" alignItems="center" gap="1" colorScheme="gray" px="2" py="1" borderRadius="full">
              <LucideTimer />
              {formatDuration(service.durationMinutes)}
            </Badge>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  )
}

export default ServiceCard
