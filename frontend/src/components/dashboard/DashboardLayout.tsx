import {
  Box,
  Container,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { BarChart, Calendar, LogOut, Menu, Scissors, Settings, User, UserCircle, Users } from "lucide-react"

import { Link, useLocation, useNavigate } from "react-router"
import { ElementType, ReactNode } from "react"
import useSignOut from "react-auth-kit/hooks/useSignOut"
import { Roles, UserState } from "@/types/users.ts"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  icon: ElementType
  href: string
  roles: Roles[]
}

const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Tổng quan", // Dashboard
    icon: BarChart,
    href: "/dashboard", 
    roles: [Roles.Manager, Roles.Stylist],
  },
  {
    label: "Lịch hẹn", // Appointments
    icon: Calendar,
    href: "/dashboard/appointments",
    roles: [Roles.Manager, Roles.Stylist],
  },
  {
    label: "Dịch vụ", // Services
    icon: Scissors, 
    href: "/dashboard/services",
    roles: [Roles.Manager],
  },
  {
    label: "Stylist", // Stylists
    icon: Users,
    href: "/dashboard/stylists", 
    roles: [Roles.Manager],
  },
  {
    label: "Khách hàng", // Customers
    icon: UserCircle,
    href: "/dashboard/customers",
    roles: [Roles.Manager],
  },
  {
    label: "Cài đặt Salon", // Salon Settings
    icon: Settings,
    href: "/dashboard/settings",
    roles: [Roles.Manager],
  },
]

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const signOut = useSignOut()
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const auth = useAuthUser<UserState>()

  if (!auth) {
    return null
  }

  const filteredMainNavItems = MAIN_NAV_ITEMS.filter((item) => item.roles.includes(auth.role))

  const handleLogout = () => {
    signOut()
    navigate("/login")
  }

  const SidebarContent = () => (
    <VStack spacing={1} align="stretch" w="full">
      {/* Main Navigation Items */}
      {filteredMainNavItems.map((item) => (
        <Box
          key={item.href}
          as={Link}
          to={item.href}
          p={3}
          borderRadius="md"
          bg={location.pathname === item.href ? "blue.500" : "transparent"}
          color={location.pathname === item.href ? "white" : undefined}
          _hover={{
            bg: location.pathname === item.href ? "blue.600" : "gray.100",
          }}
        >
          <HStack spacing={3}>
            <Icon as={item.icon} boxSize={5} />
            <Text fontWeight="medium">{item.label}</Text>
          </HStack>
        </Box>
      ))}

      {/* Divider */}
      <Divider my={4} borderColor={borderColor} />

      {/* Profile and Logout */}
      <Box
        as={Link}
        to="/dashboard/profile"
        p={3}
        borderRadius="md"
        bg={location.pathname === "/dashboard/profile" ? "blue.500" : "transparent"}
        color={location.pathname === "/dashboard/profile" ? "white" : undefined}
        _hover={{
          bg: location.pathname === "/dashboard/profile" ? "blue.600" : "gray.100",
        }}
      >
        <HStack spacing={3}>
          <Icon as={User} boxSize={5} />
          <Text fontWeight="medium">Hồ sơ</Text>
        </HStack>
      </Box>

      <Box as="button" p={3} borderRadius="md" _hover={{ bg: "gray.100" }} onClick={handleLogout}>
        <HStack spacing={3}>
          <Icon as={LogOut} boxSize={5} />
          <Text fontWeight="medium">Đăng xuất</Text>
        </HStack>
      </Box>
    </VStack>
  )

  return (
    <Flex minH="100vh">
      {/* Desktop Sidebar */}
      <Box
        display={{ base: "none", md: "block" }}
        w={64}
        bg={bgColor}
        borderRight="1px"
        borderColor={borderColor}
        p={5}
      >
        <VStack spacing={8} align="stretch">
          <Heading size="md">Stylist Portal</Heading>
          <SidebarContent />
        </VStack>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Stylist Portal</DrawerHeader>
          <DrawerBody>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1}>
        {/* Mobile Header */}
        <Box display={{ base: "block", md: "none" }} p={4} bg={bgColor} borderBottom="1px" borderColor={borderColor}>
          <IconButton icon={<Menu />} variant="ghost" onClick={onOpen} aria-label="Open Menu" />
        </Box>

        {/* Page Content */}
        <Box p={8}>
          <Container maxW="7xl">{children}</Container>
        </Box>
      </Box>
    </Flex>
  )
}

export default DashboardLayout
