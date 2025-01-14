import { Route, Routes } from "react-router"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DashboardHome from "@/components/dashboard/DashboardHome"
import AppointmentList from "@/components/dashboard/AppointmentList"
import DashboardProfile from "@/components/dashboard/DashboardProfile"
import ServiceManagement from "@/components/dashboard/ServiceManagement"
import StylistManagement from "@/components/dashboard/StylistManagement"
import CustomerManagement from "@/components/dashboard/CustomerManagement"
import SalonSettings from "@/components/dashboard/SalonSettings"
import { ManagerLayout } from "@/components/dashboard/ManagerLayout.tsx"

function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        {/* Shared routes */}
        <Route path="/" element={<DashboardHome />} />
        <Route path="/appointments" element={<AppointmentList />} />
        <Route path="/profile" element={<DashboardProfile />} />

        {/* Manager routes */}
        <Route element={<ManagerLayout />}>
          <Route path="/services" element={<ServiceManagement />} />
          <Route path="/stylists" element={<StylistManagement />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/settings" element={<SalonSettings />} />
        </Route>
      </Routes>
    </DashboardLayout>
  )
}

export default DashboardPage
