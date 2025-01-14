import { Service } from "@/types/services.ts"
import { Stylist } from "@/types/stylists.ts"

export enum AppointmentStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Cancelled = "Cancelled",
  Completed = "Completed",
  NoShow = "NoShow",
}

export interface Appointment {
  id: string
  customerId: string
  stylistId: string
  serviceId: string
  dateTime: Date
  status: AppointmentStatus
  customerNotes?: string
  stylistNotes?: string
  totalPrice: number
}

export interface BookingData {
  service?: Service
  stylist?: Stylist
  dateTime?: Date
  notes?: string
}
