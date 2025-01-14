import api from "./index"
import { Roles } from "@/types/users.ts"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  expires: Date
  userId: string
  role: Roles
}

export interface RegisterCredentials {
  firstName: string
  lastName: string
  email: string
  password: string
  phoneNumber: string
}

interface VerifyEmailPayload {
  email: string
  token: string
}

interface ResendVerificationPayload {
  email: string
}

interface ForgotPasswordPayload {
  email: string
}

interface ResetPasswordPayload {
  email: string
  token: string
  newPassword: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export const authApi = {
  login: (credentials: LoginCredentials) => api.post<AuthResponse>("/auth/login", credentials),

  register: (data: RegisterCredentials) => api.post<void>("/auth/register", data),

  forgotPassword: (data: ForgotPasswordPayload) => api.post<void>("/auth/forgot-password", data),

  resetPassword: (data: ResetPasswordPayload) => api.post<void>("/auth/reset-password", data),

  verifyEmail: (data: VerifyEmailPayload) => api.post<void>("/auth/confirm-email", data),

  resendVerification: (data: ResendVerificationPayload) => api.post<void>("/auth/resend-confirmation-email", data),

  changePassword: (data: ChangePasswordPayload) => api.put<void>("/auth/change-password", data),
}
