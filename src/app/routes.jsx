import { createBrowserRouter } from "react-router-dom";
import ServicesPage from "../pages/ServicesPage";
import PortfolioPage from "../pages/PortfolioPage";

export const router = createBrowserRouter([
  { path: "/", element: <ServicesPage /> },
  { path: "/portfolio", element: <PortfolioPage /> },
]);
