import api from "./index"
import { Service } from "@/types/services"
import { Stylist } from "@/types/stylists.ts"

export interface GetServicesParams {
  page?: number
  pageSize?: number
}

export const servicesApi = {
  // Get all services
  getServices: (params?: GetServicesParams) => api.get<Service[]>("/services", { params }),

  // Get single service
  getService: (id: string) => api.get<Service>(`/services/${id}`),

  // Get stylists for service
  getServiceStylists: (id: string) => api.get<Stylist[]>(`/services/${id}/stylists`),

  // Update service
  updateService: (id: string, editingService: Service) => api.put<Service>(`/services/${id}`, editingService),

  // Create service
  createService: (editingService: Service) => api.post<Service>("/services", editingService),

  // Delete service stylists
  removeServiceStylist: (id: string, stylistId: string) => api.delete(`/services/${id}/stylists/${stylistId}`),

  // Add service stylist
  addServiceStylist: (id: string, stylistId: string) => api.put(`/services/${id}/stylists/${stylistId}`),
}
