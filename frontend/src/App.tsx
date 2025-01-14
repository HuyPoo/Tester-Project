import { Route, Routes } from "react-router"
import {
  AboutPage,
  BookPage,
  ChangePasswordPage,
  DashboardPage,
  EmailVerificationPage,
  ForbiddenPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  LogoutPage,
  MyAppointmentsPage,
  NotFoundPage,
  RegisterPage,
  ResetPasswordPage,
  ServicesPage,
} from "@/pages"
import { ProtectedRoute } from "@/ProtectedRoute.tsx"
import { Roles } from "@/types/users.ts"
import { PublicRoute } from "@/PublicRoute.tsx"

function App() {
  return (
    <Routes>
      {/* Public routes that anyone can access */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />

      {/* Routes only for non-authenticated users */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute allowedRoles={[Roles.Customer, Roles.Stylist, Roles.Manager]} />}>
        <Route path="/logout" element={<LogoutPage />} />
      </Route>

      {/* Protected customer routes */}
      <Route element={<ProtectedRoute allowedRoles={[Roles.Customer]} />}>
        <Route path="/book" element={<BookPage />} />
        <Route path="/appointments" element={<MyAppointmentsPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute allowedRoles={[Roles.Manager, Roles.Stylist]} />}>
        <Route path="/dashboard/*" element={<DashboardPage />} />
      </Route>

      {/* Error routes */}
      <Route path="/403" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
