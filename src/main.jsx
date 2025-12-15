import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom' 
import router from './Routes/router.jsx'
import './App.css'
import './index.css' // Ensure your Tailwind/Global styles are here

// 1. Import BOTH Providers
import { VehicleProvider } from './context/VehicleContext.jsx'; 
import { AuthProvider } from './context/AuthContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap everything in AuthProvider first, then VehicleProvider */}
    <AuthProvider>
      <VehicleProvider>
        <RouterProvider router={router} />
      </VehicleProvider>
    </AuthProvider>
  </StrictMode>,
)