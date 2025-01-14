import { Navigate, Outlet } from "react-router"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { UserState } from "@/types/users"

export function PublicRoute() {
  const user = useAuthUser<UserState>()

  if (!user) {
    return <Outlet />
  }

  if (user.role === "Manager" || user.role === "Stylist") {
    return <Navigate to="/dashboard" replace />
  }

  return <Navigate to="/appointments" replace />
}
