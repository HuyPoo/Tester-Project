import { Box } from "@chakra-ui/react"
import { ReactNode } from "react"
import Footer from "@/components/footer/Footer.tsx"
import Header from "@/components/header/Header.tsx"

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box as="main" pt="64px" flex="1">
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default Layout
