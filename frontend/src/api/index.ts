import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5010",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("_auth")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  config.headers["Content-Type"] = "application/json"
  return config
})

export default api
