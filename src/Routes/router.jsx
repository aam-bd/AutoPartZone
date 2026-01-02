// --- src/router.jsx (UPDATED) ---
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "../App";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import ContactPage from "../Pages/ContactPage";

// E-commerce Specific Pages
import ProductDetailsPage from "../Pages/Pages/ProductDetailsPage";
import CartPage from "../Pages/CartPage";
import CheckoutPage from "../Pages/CheckoutPage";
import AccountPage from "../Pages/AccountPage";
import CategoryPage from "../Pages/CategoryPage";
import OrderConfirmationPage from "../Pages/OrderConfirmationPage";
import OrderDetailsPage from "../Pages/OrderDetailsPage";
import ShopPage from "../Pages/ShopPage"; // **NEW: Assuming you create this page**
import AdminDashboard from "../Pages/AdminDashboard.jsx"; // **NEW: Admin Dashboard**
import AdminProductManagement from "../Pages/AdminProductManagement.jsx"; // **NEW: Admin Product Management**
import ReportsDashboard from "../Pages/ReportsDashboard.jsx"; // **NEW: Reports Dashboard**
import OrderHistory from "../Pages/OrderHistory.jsx"; // **NEW: Order History**
import ProfilePage from "../Pages/ProfilePage.jsx"; // **NEW: Profile Page**
import UserManagement from "../Pages/UserManagement.jsx"; // **NEW: User Management Page**

import AboutPage from "../Pages/About";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    hydrateFallbackElement: <p>Loading...</p>,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      // **NEW SHOP PAGE ROUTE**
      {
        path: "shop",
        element: <ShopPage />,
      },
      // **INDIVIDUAL PRODUCT ROUTE (singular)**
      {
        path: "product/:productId",
        element: <ProductDetailsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "order-confirmation",
        element: <OrderConfirmationPage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "category/:categoryName",
        element: <CategoryPage />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
        children: [
          {
            path: "products",
            element: <AdminProductManagement />,
          },
          {
            path: "users",
            element: <UserManagement />,
          },
        ],
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "admin/reports",
        element: <ReportsDashboard />,
      },
{
        path: "orders",
        element: <OrderHistory />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetailsPage />,
      },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/contact",
    Component: ContactPage,
  },
  {
    path: "/about",
    Component: AboutPage,
  },
]);

export default router;
