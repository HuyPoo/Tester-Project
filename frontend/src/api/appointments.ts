import api from "./index"
import { Appointment, AppointmentStatus } from "@/types/appointments"

interface GetAppointmentsParams {
  page?: number
  pageSize?: number
  all?: boolean
}

interface CreateAppointmentPayload {
  stylistId: string
  serviceId: string
  dateTime: Date
  notes?: string
}

export const appointmentsApi = {
  // Cancel appointment
  cancelAppointment: (appointmentId: string, reason: string) =>
    api.post<Appointment>(`/appointments/${appointmentId}/cancel`, { reason }),

  // Create new appointment
  createAppointment: (data: CreateAppointmentPayload) => api.post<Appointment>("/appointments", data),

  // Get all appointments
  getAppointments: (params?: GetAppointmentsParams) => api.get<Appointment[]>("/appointments", { params }),

  // Update appointment status
  updateAppointmentStatus: (appointmentId: string, data: { status: AppointmentStatus; notes?: string }) =>
    api.put<Appointment>(`/appointments/${appointmentId}/status`, data),
}
