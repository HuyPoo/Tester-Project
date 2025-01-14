import { Navigate, Outlet } from "react-router"
import useAuthUser from "react-auth-kit/hooks/useAuthUser"
import { Roles, UserState } from "@/types/users.ts"

export function ManagerLayout() {
  const auth = useAuthUser<UserState>()

  if (auth?.role !== Roles.Manager) {
    return <Navigate to="/403" replace />
  }

  return <Outlet />
}
