import { useEffect, useState } from "react"
import {
  Container,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  VStack,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import Layout from "@/components/Layout"
import UpcomingAppointments from "@/components/appointments/UpcomingAppointments"
import AppointmentHistory from "@/components/appointments/AppointmentHistory"
import CustomerProfile from "@/components/appointments/CustomerProfile"
import { Appointment, AppointmentStatus } from "@/types/appointments"
import { Customer } from "@/types/customers"
import { customersApi } from "@/api/customers"

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [customer, setCustomer] = useState<Customer>()
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [appointmentsResponse, customerResponse] = await Promise.all([
        customersApi.getMyAppointments(),
        customersApi.getMe(),
      ])

      setAppointments(appointmentsResponse.data)
      setCustomer(customerResponse.data)
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Lỗi tải dữ liệu",
        description: axiosError.response?.data?.message || "Không thể tải thông tin của bạn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (updatedProfile: Customer) => {
    try {
      const response = await customersApi.updateMe(updatedProfile)
      setCustomer(response.data)
      toast({
        title: "Hồ sơ đã được cập nhật",
        status: "success",
        duration: 3000,
      })
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Cập nhật thất bại",
        description: axiosError.response?.data?.message || "Không thể cập nhật hồ sơ",
        status: "error",
        duration: 3000,
      })
    }
  }

  const upcomingAppointments = appointments.filter((apt) =>
    [AppointmentStatus.Pending, AppointmentStatus.Confirmed].includes(apt.status),
  )
  const pastAppointments = appointments.filter((apt) =>
    [AppointmentStatus.Completed, AppointmentStatus.Cancelled].includes(apt.status),
  )

  if (isLoading) {
    return (
      <Layout>
        <Container centerContent py={10}>
          <Spinner size="xl" />
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxW="6xl" py={10}>
        <VStack spacing={8} align="stretch">
          <Heading size="xl">Lịch hẹn của tôi</Heading>
          <Tabs>
            <TabList>
              <Tab>Lịch hẹn sắp tới</Tab>
              <Tab>Lịch sử lịch hẹn</Tab>
              <Tab>Hồ sơ của tôi</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <UpcomingAppointments appointments={upcomingAppointments} onCancelled={loadData} />
              </TabPanel>
              <TabPanel>
                <AppointmentHistory appointments={pastAppointments} />
              </TabPanel>
              <TabPanel>{customer && <CustomerProfile profile={customer} onUpdate={handleProfileUpdate} />}</TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Layout>
  )
}

export default MyAppointmentsPage
