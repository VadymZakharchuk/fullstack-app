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

export const router = createBrowserRouter([
  // Публічні маршрути
  { path: "/", element: <HomePage /> }, // Використовуємо 'element'
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <LoginPage /> },
  { path: "/blog", element: <BlogPage /> },

  {
    element: <PrivateRoute />,
    children: [
      { path: "/main", element: <MainPage /> },
      { path: "/features", element: <FeaturesPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/about", element: <AboutPage /> },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);
