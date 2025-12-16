import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' 
import router from './Routes/router.jsx'
import './App.css'
import './index.css' // Ensure your Tailwind/Global styles are here

// Import all Providers
import { VehicleProvider } from './context/VehicleContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <VehicleProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </VehicleProvider>
    </AuthProvider>
  </StrictMode>,
)