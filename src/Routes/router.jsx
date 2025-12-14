// --- src/router.jsx (UPDATED) ---
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import App from "../App";             
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";
import Login from "../Pages/Login";

// E-commerce Specific Pages
import ProductDetailsPage from "../Pages/Pages/ProductDetailsPage";
import CartPage from "../Pages/CartPage";
import CheckoutPage from "../Pages/CheckoutPage";
import AccountPage from "../Pages/AccountPage";
import CategoryPage from "../Pages/CategoryPage"; 
import OrderConfirmationPage from "../Pages/OrderConfirmationPage";
import ShopPage from "../Pages/ShopPage"; // **NEW: Assuming you create this page**

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,          
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
        path: "login",
        element: <Login />,
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
        path: "about",
        element: (
          <div className="p-8 text-center text-3xl font-bold">About AutoPartZone</div>
        ),
      },
    ],
  },
]);

export default router;