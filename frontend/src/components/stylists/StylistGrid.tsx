import { Stylist } from "@/types/stylists"
import { Box, SimpleGrid } from "@chakra-ui/react"
import StylistCard from "@/components/stylists/StylistCard.tsx"

interface StylistGridProps {
  lg?: number
  stylists: Stylist[]
  onClick?: (stylist: Stylist) => void
  disableDetails?: boolean
}

export default function StylistGrid({ lg = 3, stylists, onClick, disableDetails }: StylistGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: lg }} spacing={8}>
      {stylists.map((stylist) => (
        <Box
          key={stylist.id}
          cursor="pointer"
          onClick={() => {
            if (onClick) onClick(stylist)
          }}
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.02)" }}
        >
          <StylistCard stylist={stylist} disableDetails={disableDetails} />
        </Box>
      ))}
    </SimpleGrid>
  )
}
