import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "../App"
import ErrorPage from "../Pages/ErrorPage";
import Login from "../Pages/Login";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
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
    element: (
      <p className="text-center text-3xl font-bold">This is about page</p>
    ),
  },
  {
    path: "/Login",
    element: <Login />
  }
]);
export default router;
