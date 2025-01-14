import HeroSection from "@/components/hero/HeroSection.tsx"
import FeaturedServices from "@/components/services/FeaturedServices.tsx"
import FeaturedStylists from "@/components/stylists/FeaturedStylists.tsx"
import ContactSection from "@/components/contact/ContactSection.tsx"
import { Box } from "@chakra-ui/react"
import Layout from "@/components/Layout.tsx"

const HomePage = () => {
  return (
    <Layout>
      <Box>
        <HeroSection />
        <FeaturedServices />
        <FeaturedStylists />
        <ContactSection />
      </Box>
    </Layout>
  )
}

export default HomePage
