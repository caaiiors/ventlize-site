import { createBrowserRouter } from "react-router-dom";
import ServicesPage from "../pages/ServicesPage";
import PortfolioPage from "../pages/PortfolioPage";
import AdminPanel from "../pages/AdminPanel";

export const router = createBrowserRouter([
  { path: "/", element: <ServicesPage /> },
  { path: "/portfolio", element: <PortfolioPage /> },
  { path: "/admin", element: <AdminPanel /> },
]);
