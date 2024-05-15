import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import { routes } from "./shared/routes";
import { RouterProvider } from "react-router-dom";
import { theme } from "./shared/themes";
import { AuthProvider } from "./shared/providers/auth_provider";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={routes} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
