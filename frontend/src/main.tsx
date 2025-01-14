import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter } from "react-router"
import AuthProvider from "react-auth-kit"
import createStore from "react-auth-kit/createStore"

const store = createStore({
  authType: "localstorage",
  authName: "_auth",
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>,
)
