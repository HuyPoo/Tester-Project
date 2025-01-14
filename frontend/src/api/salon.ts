import api from "./index"

export interface SalonSettings {
  name: string
  description: string
  address: string
  phoneNumber: string
  email: string
  openingTime: string
  closingTime: string
  leadWeeks: number
}

export const salonApi = {
  getSalon: () => api.get<SalonSettings>("/salon"),

  updateSalon: (data: SalonSettings) => api.put<void>("/salon", data),
}
