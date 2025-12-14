import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "../App"
import contact from "../Pages/ContactPage";
import ErrorPage from "../Pages/ErrorPage";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import AboutPage from "../Pages/About";
const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    hydrateFallbackElement: <p>Loading...</p>,
    loader: () => fetch('Doctors.json'),
    errorElement: <ErrorPage />,
    children: [
        {
            path: '/home',
            element:<></>,
            errorElement: <ErrorPage />
        },
    ],
  },
  {
    path: "/about",
    Component: AboutPage
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/contact",
    Component: contact
  }
]);
export default router;
