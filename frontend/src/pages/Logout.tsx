import { useEffect } from "react"
import { useNavigate } from "react-router"
import useSignOut from "react-auth-kit/hooks/useSignOut"

function LogoutPage() {
  const signOut = useSignOut()
  const navigate = useNavigate()

  useEffect(() => {
    signOut()
    navigate("/login")
  }, [signOut, navigate])

  return null
}

export default LogoutPage
