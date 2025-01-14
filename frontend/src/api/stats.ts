import api from "@/api/index.ts"

interface AppointmentStats {
  startDate: Date
  endDate: Date
  totalAppointments: number
  stylistId?: string
}

interface RevenueStats {
  startDate: Date
  endDate: Date
  totalRevenue: number
  stylistId?: string
}

export const statsApi = {
  getAppointmentStats: (startDate: Date, endDate: Date) =>
    api.get<AppointmentStats>("/stats/appointments", {
      params: {
        startDate,
        endDate,
      },
    }),

  getRevenueStats: (startDate: Date, endDate: Date) =>
    api.get<RevenueStats>("/stats/revenue", {
      params: {
        startDate,
        endDate,
      },
    }),
}
