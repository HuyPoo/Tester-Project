import { Navigate, Outlet } from "react-router"
import { Roles, UserState } from "@/types/users"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"

interface ProtectedRouteProps {
  allowedRoles: Roles[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthUser<UserState>()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
