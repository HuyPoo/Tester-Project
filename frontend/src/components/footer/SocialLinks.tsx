import { IconButton, Stack, useColorModeValue } from "@chakra-ui/react"
import FacebookIcon from "@/assets/FacebookIcon.tsx"
import InstagramIcon from "@/assets/InstagramIcon.tsx"
import TwitterIcon from "@/assets/TwitterIcon.tsx"

export default function SocialLinks() {
  const socialBgColor = useColorModeValue("gray.100", "gray.700")
  const socialHoverBgColor = useColorModeValue("gray.200", "gray.600")

  return (
    <Stack direction={"row"} spacing={2}>
      <IconButton
        aria-label="Facebook"
        icon={<FacebookIcon size={20} />}
        rounded={"full"}
        bg={socialBgColor}
        _hover={{ bg: socialHoverBgColor }}
      />
      <IconButton
        aria-label="Instagram"
        icon={<InstagramIcon size={20} />}
        rounded={"full"}
        bg={socialBgColor}
        _hover={{ bg: socialHoverBgColor }}
      />
      <IconButton
        aria-label="Twitter"
        icon={<TwitterIcon size={20} />}
        rounded={"full"}
        bg={socialBgColor}
        _hover={{ bg: socialHoverBgColor }}
      />
    </Stack>
  )
}
