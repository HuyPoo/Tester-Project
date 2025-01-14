import { Box, SimpleGrid } from "@chakra-ui/react"
import ServiceCard from "@/components/services/ServiceCard.tsx"
import { Service } from "@/types/services.ts"

interface ServiceGridProps {
  lg?: number
  services: Service[]
  onClick?: (service: Service) => void
}

function ServiceGrid({ lg = 3, services, onClick }: ServiceGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: lg }} spacing={8}>
      {services.map((service) => (
        <Box
          key={service.id}
          onClick={() => {
            if (onClick) onClick(service)
          }}
          cursor="pointer"
          transition="transform 0.2s"
          _hover={{ transform: "scale(1.02)" }}
        >
          <ServiceCard service={service} />
        </Box>
      ))}
    </SimpleGrid>
  )
}

export default ServiceGrid
