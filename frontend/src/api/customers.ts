import api from "@/api/index.ts"
import { Appointment } from "@/types/appointments.ts"
import { Customer } from "@/types/customers.ts"

interface GetAppointmentsParams {
  page?: number
  pageSize?: number
  all?: boolean
}

export const customersApi = {
  // Get customer's appointments
  getMyAppointments: (params?: GetAppointmentsParams) =>
    api.get<Appointment[]>("/customers/me/appointments", { params }),

  // Get customer profile
  getMe: () => api.get<Customer>("/customers/me"),

  // Update customer profile
  updateMe: (data: Customer) => api.put<Customer>("/customers/me", data),

  // Get all customers
  getCustomers: (params?: { page?: number; pageSize?: number }) => api.get<Customer[]>("/customers", { params }),

  // Get customer details
  getCustomer: (customerId: string) => api.get<Customer>(`/customers/${customerId}`),

  // Get customer's appointments
  getCustomerAppointments: (customerId: string, params?: GetAppointmentsParams) =>
    api.get<Appointment[]>(`/customers/${customerId}/appointments`, { params }),

  // Delete customer
  deleteCustomer: (customerId: string) => api.delete(`/customers/${customerId}`),
}
