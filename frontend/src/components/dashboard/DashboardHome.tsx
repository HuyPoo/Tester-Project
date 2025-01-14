import { Box, Heading, SimpleGrid, useColorModeValue, useToast, VStack } from "@chakra-ui/react"
import { BarChart, Calendar } from "lucide-react"
import StatCard from "./StatCard"
import { useEffect, useState } from "react"
import { statsApi } from "@/api/stats.ts"
import { formatPrice } from "@/utils/formats.ts"

function DashboardHome() {
  const bgColor = useColorModeValue("white", "gray.800")

  const [todayAppointments, setTodayAppointments] = useState(0)
  const [differenceAppointments, setDifferenceAppointments] = useState(0)

  const [weeklyRevenue, setWeeklyRevenue] = useState(0)
  const [differenceRevenue, setDifferenceRevenue] = useState(0)

  const toast = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Calculate date ranges for appointments
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date()
      todayEnd.setHours(23, 59, 59, 999)

      const yesterdayStart = new Date(todayStart)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)
      const yesterdayEnd = new Date(todayEnd)
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)

      // Calculate date ranges for revenue
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Start of current week (Sunday)
      weekStart.setHours(0, 0, 0, 0)

      const weekEnd = new Date()
      weekEnd.setDate(weekStart.getDate() + 6) // End of current week (Saturday)
      weekEnd.setHours(23, 59, 59, 999)

      const lastWeekStart = new Date(weekStart)
      lastWeekStart.setDate(lastWeekStart.getDate() - 7)
      const lastWeekEnd = new Date(weekEnd)
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7)

      const [todayStats, yesterdayStats, currentWeekRevenue, lastWeekRevenue] = await Promise.all([
        statsApi.getAppointmentStats(todayStart, todayEnd),
        statsApi.getAppointmentStats(yesterdayStart, yesterdayEnd),
        statsApi.getRevenueStats(weekStart, weekEnd),
        statsApi.getRevenueStats(lastWeekStart, lastWeekEnd),
      ])

      setTodayAppointments(todayStats.data.totalAppointments)
      setDifferenceAppointments(todayStats.data.totalAppointments - yesterdayStats.data.totalAppointments)
      setWeeklyRevenue(currentWeekRevenue.data.totalRevenue)
      setDifferenceRevenue(currentWeekRevenue.data.totalRevenue - lastWeekRevenue.data.totalRevenue)
    } catch (error) {
      toast({
        title: "Lỗi tải số liệu thống kê",
        description: "Vui lòng thử lại sau",
        status: "error",
        duration: 3000,
      })
    }
  }
  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label={"Lịch hẹn hôm nay"}
          value={todayAppointments.toString()}
          icon={Calendar}
          change={
            differenceAppointments === 0 ? "0" : `${differenceAppointments > 0 ? "+" : ""}${differenceAppointments}`
          }
        />
        <StatCard
          label={"Doanh thu tuần"}
          value={formatPrice(weeklyRevenue)}
          icon={BarChart}
          change={
            differenceRevenue === 0 ? "0" : `${differenceRevenue > 0 ? "+" : ""}${formatPrice(differenceRevenue)}`
          }
        />
      </SimpleGrid>

      <Box bg={bgColor} p={6} rounded="lg" shadow="sm">
        <Heading size="md" mb={6}>
          Lịch hẹn sắp tới
        </Heading>
      </Box>
    </VStack>
  )
}

export default DashboardHome
