import api from "./index"
import { Stylist } from "@/types/stylists"
import { Service } from "@/types/services.ts"
import { Appointment } from "@/types/appointments.ts"

interface GetStylistsParams {
  page?: number
  pageSize?: number
}

export interface GetStylistServicesParams {
  page?: number
  pageSize?: number
}

export interface ServiceSlots {
  stylistId: string
  serviceId: string
  date: string
  slots: {
    item1: Date
    item2: boolean
  }[]
}

export const stylistsApi = {
  // Get all stylists
  getStylists: (params?: GetStylistsParams) => api.get<Stylist[]>("/stylists", { params }),

  // Get featured stylists (limit=3)
  getFeaturedStylists: () =>
    api.get<Stylist[]>("/stylists", {
      params: {
        pageSize: 3,
        featured: true,
      },
    }),

  // Get stylist details
  getStylist: (id: string) => api.get<Stylist>(`/stylists/${id}`),

  // Get services offered by a stylist
  getStylistServices: (stylistId: string, params?: GetStylistServicesParams) =>
    api.get<Service[]>(`/stylists/${stylistId}/services`, { params }),

  // Get stylist profile
  getMyProfile: () => api.get<Stylist>("/stylists/me"),

  // Update stylist profile
  updateMyProfile: (data: Stylist) => api.put<Stylist>("/stylists/me", data),

  // Get my appointments
  getMyAppointments: () => api.get<Appointment[]>("/stylists/me/appointments"),

  // Get stylist service slots
  getStylistServiceSlots: (stylistId: string, serviceId: string, date: string) =>
    api.get<ServiceSlots>(`/stylists/${stylistId}/services/${serviceId}/slots`, {
      params: {
        date,
      },
    }),
  updateStylist: (id: string, stylist: Stylist) => api.put<Stylist>(`/stylists/${id}`, stylist),
  createStylist: (stylist: Stylist) => api.post<Stylist>("/stylists", stylist),
}
