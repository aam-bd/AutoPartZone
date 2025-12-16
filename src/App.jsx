import { Outlet } from 'react-router-dom'; // 1. Necessary for displaying child routes
import './App.css'; 

// Import your structural components from the Components folder
// You may need to create a dedicated Layout folder for these:
import Navbar from './Components/Navbar'; // Your design's full Header (Top Bar + Main Nav)
import Footer from './Components/Footer'; // Your design's full Footer (Exclusive Section + Links)

console.log('App component loading...');

function App() {
  console.log('App component rendering...');
  
  return (
    <div className="app-layout">
      
      {/* 1. Header/Navigation (Consistent across all pages) */}
      <Navbar />

      {/* 2. Main Content Area */}
      {/* The <Outlet /> renders the content of the current matching route: 
          Home, ProductDetailsPage, CartPage, etc. */}
      <main className="content-wrapper">
        <Outlet />
      </main>

      {/* 3. Footer (Consistent across all pages) */}
      <Footer />
      
    </div>
  );
}

export default App;