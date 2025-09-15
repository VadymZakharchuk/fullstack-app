// src/routes.tsx
import { createBrowserRouter } from "react-router";
import PrivateRoute from "../components/PrivateRoute";
import HomePage from "../pages/home-page/HomePage";
import LoginPage from "../pages/login-page/LoginPage";
import MainPage from "../pages/main-page/MainPage";
import FeaturesPage from "../pages/features-page/FeaturesPage";
import PricingPage from "../pages/pricing-page/PricingPage";
import BlogPage from "../pages/blog-page/BlogPage";
import AboutPage from "../pages/about-page/AboutPage";
import NotFoundPage from "../pages/NotFoundPage";
import SettingsPage from "../pages/settings-page/SettingsPage.tsx";
import AnalyticsPage from "../pages/main-page/analytics/AnalyticsPage.tsx";
import AnomaliesPage from "../pages/main-page/anomalies/AnomaliesPage.tsx";
import ForecastPage from "../pages/main-page/forecast/ForecastPage.tsx";
import TransactionsPage from "../pages/main-page/transactions/TransactionsPage.tsx";

export const router = createBrowserRouter([
  // Публічні маршрути
  { path: "/", element: <HomePage /> }, // Використовуємо 'element'
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <LoginPage /> },
  { path: "/blog", element: <BlogPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/features", element: <FeaturesPage /> },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/main",
        element: <MainPage />,
        children: [
          { path: "transactions", element: <TransactionsPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "forecast", element: <ForecastPage /> },
          { path: "anomalies", element: <AnomaliesPage /> },
        ]
      },
      { path: "/settings", element: <SettingsPage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
