import { useEffect, useState } from "react"
import { LucideMail, LucidePhone, LucideTimer } from "lucide-react"
import {
  Avatar,
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { Stylist } from "@/types/stylists"
import { Service } from "@/types/services"
import { stylistsApi } from "@/api/stylists"
import { formatDuration, formatPrice } from "@/utils/formats"

interface StylistCardProps {
  stylist: Stylist
  disableDetails?: boolean
}

function StylistCard({ stylist, disableDetails = false }: StylistCardProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      loadStylistServices()
    }
  }, [isOpen])

  const loadStylistServices = async () => {
    setIsLoading(true)
    try {
      const response = await stylistsApi.getStylistServices(stylist.id)
      setServices(response.data)
    } catch (error) {
      toast({
        title: "Lỗi tải dịch vụ",
        description: "Không thể tải các dịch vụ của nhà tạo mẫu",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card
        maxW="sm"
        cursor={disableDetails ? "default" : "pointer"}
        transition="all 0.3s ease"
        _hover={{
          transform: disableDetails ? "none" : "translateY(-8px)",
          boxShadow: disableDetails ? "base" : "xl",
        }}
        onClick={() => {
          if (!disableDetails) onOpen()
        }}
      >
        <CardBody>
          <Stack spacing={4} align="center">
            <Avatar size="2xl" name={`${stylist.firstName} ${stylist.lastName}`} src={stylist.imageUrl} mb={2} />
            <Heading size="md" textAlign="center">
              {stylist.firstName} {stylist.lastName}
            </Heading>
            {stylist.bio && (
              <Text noOfLines={2} color="gray.600" fontSize="sm" textAlign="center">
                {stylist.bio}
              </Text>
            )}
            {stylist.specialties && stylist.specialties.length > 0 && (
              <Wrap justify="center" spacing={2}>
                {stylist.specialties.map((specialty, index) => (
                  <WrapItem key={index}>
                    <Tag size="sm" colorScheme="blue" borderRadius="full">
                      {specialty}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            )}
          </Stack>
        </CardBody>
      </Card>

      {/* Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={4}>
              <Avatar size="md" name={`${stylist.firstName} ${stylist.lastName}`} src={stylist.imageUrl} />
              <VStack align="start" spacing={0}>
                <Text>
                  {stylist.firstName} {stylist.lastName}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Nhà tạo mẫu
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pb={6}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Profile</Tab>
                <Tab>Services ({services.length})</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {/* Profile Information */}
                    {stylist.bio && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          About
                        </Text>
                        <Text color="gray.600">{stylist.bio}</Text>
                      </Box>
                    )}

                    <Box>
                      <Text fontWeight="bold" mb={2}>
                        Contact Information
                      </Text>
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Icon as={LucideMail} color="blue.500" />
                          <Text>{stylist.email}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={LucidePhone} color="blue.500" />
                          <Text>{stylist.phoneNumber}</Text>
                        </HStack>
                      </VStack>
                    </Box>

                    {stylist.specialties && stylist.specialties.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={2}>
                          Specialties
                        </Text>
                        <Wrap>
                          {stylist.specialties.map((specialty, index) => (
                            <WrapItem key={index}>
                              <Tag colorScheme="blue" borderRadius="full">
                                {specialty}
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )}
                  </VStack>
                </TabPanel>

                <TabPanel>
                  {isLoading ? (
                    <VStack py={8}>
                      <Spinner size="xl" />
                    </VStack>
                  ) : (
                    <VStack spacing={4} align="stretch">
                      {services.map((service) => (
                        <Box key={service.id} p={4} borderWidth="1px" borderRadius="lg" _hover={{ bg: "gray.50" }}>
                          <HStack justify="space-between" mb={2}>
                            <Heading size="sm">{service.name}</Heading>
                            <HStack spacing={2}>
                              <Badge colorScheme="green">{formatPrice(service.price)}</Badge>
                              <Badge colorScheme="blue">
                                <HStack spacing={1}>
                                  <LucideTimer size={14} />
                                  <Text>{formatDuration(service.durationMinutes)}</Text>
                                </HStack>
                              </Badge>
                            </HStack>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {service.description}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default StylistCard
