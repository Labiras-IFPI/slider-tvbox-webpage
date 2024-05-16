import {
  Navigate,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import ImagesManagementPage from "../../pages/imageManagementPage";
import { NavBar } from "../components/navBar";
import { MainLayout } from "../components/layout";
import { LoginPage } from "../../pages/login";
import { AuthContext } from "../providers/auth_provider";
import { useContext } from "react";
import { LoadingPage } from "../components/loadingPage";
import { Error404 } from "../components/errors/error404";
import { MotionTest } from "../components/ComponentsTests";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (!user && loading) {
    return <LoadingPage />;
  }

  return user ? children : <Navigate to={"/login"} replace />;
};

const routes = createHashRouter([
  {
    path: "/gerenciador",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <NavBar />
          <ImagesManagementPage height={"85%"} />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    index: true,
    errorElement: <Error404 />,
    element: (
      <MainLayout>
        <LoginPage />
      </MainLayout>
    ),
  },
]);

export { routes };
