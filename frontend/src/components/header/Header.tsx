import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react"
import { Calendar, Home, Info, LogOut, LucideKey, Menu as MenuIcon, Scissors, X as CloseIcon } from "lucide-react"
import { Link as RouterLink, useLocation, useNavigate } from "react-router"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { UserState } from "@/types/users.ts"

const NAV_ITEMS = [
  {
    label: "Trang chủ",
    href: "/",
    icon: Home,
  },
  {
    label: "Giới thiệu",
    href: "/about",
    icon: Info,
  },
  {
    label: "Dịch vụ",
    href: "/services",
    icon: Scissors,
  },
]

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthUser<UserState>()

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const linkBgColor = useColorModeValue("gray.200", "gray.700")

  const handleLogout = () => {
    navigate("/logout")
  }

  return (
    <Box
      as="header"
      bg={bgColor}
      px={4}
      position="fixed"
      w="100%"
      top={0}
      zIndex={1000}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          aria-label="Open Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />

        <HStack spacing={8} alignItems="center">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              Virgo 14
            </Text>
          </Link>

          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            {NAV_ITEMS.map((navItem) => (
              <Link
                key={navItem.label}
                as={RouterLink}
                to={navItem.href}
                px={2}
                py={1}
                rounded="md"
                display="flex"
                alignItems="center"
                gap={2}
                _hover={{
                  textDecoration: "none",
                  bg: linkBgColor,
                }}
                bg={location.pathname === navItem.href ? linkBgColor : "transparent"}
              >
                <navItem.icon size={18} />
                {navItem.label}
              </Link>
            ))}
          </HStack>
        </HStack>

        <Menu>
          <MenuButton as={Button} rounded="full" variant="link" cursor="pointer" minW={0}>
            <Avatar size="sm" />
          </MenuButton>
          <MenuList>
            {user ? (
              <>
                <MenuItem as={RouterLink} to="/appointments" icon={<Calendar size={18} />}>
                  Lịch hẹn của tôi
                </MenuItem>
                <MenuItem as={RouterLink} to="/change-password" icon={<LucideKey size={18} />}>
                  Thay đổi mật Khẩu
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={handleLogout} icon={<LogOut size={18} />}>
                  Đăng xuất
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem as={RouterLink} to="/login">
                  Đăng nhập
                </MenuItem>
                <MenuItem as={RouterLink} to="/register">
                  Đăng ký
                </MenuItem>
              </>
            )}
          </MenuList>
        </Menu>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Danh mục</DrawerHeader>

          <DrawerBody>
            <Stack as="nav" spacing={4}>
              {NAV_ITEMS.map((navItem) => (
                <Link
                  key={navItem.label}
                  as={RouterLink}
                  to={navItem.href}
                  px={2}
                  py={1}
                  rounded="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  _hover={{
                    textDecoration: "none",
                    bg: linkBgColor,
                  }}
                  bg={location.pathname === navItem.href ? linkBgColor : "transparent"}
                  onClick={onClose}
                >
                  <navItem.icon size={18} />
                  {navItem.label}
                </Link>
              ))}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header
