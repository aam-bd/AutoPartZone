import React, { useState, useEffect } from 'react';

// Core structural components
import Footer from "../Components/Footer";
import Carousel from "../Components/Carousel";

// Section components based on your design
import CategorySidebar from "../Components/CategorySidebar"; // Left-hand menu
import AiVehicleSelector from "../Components/AiVehicleSelector"; // Search/Selector bar
import ProductGridSection from "../Components/ProductGridSection"; // For 'Flash Sales' and 'Explore'
import FullWidthBanner from "../Components/FullWidthBanner"; // For Battery/Engine ads
import ServiceInfoBar from "../Components/ServiceInfoBar"; // Bottom delivery/support info

// Services
import productService from '../services/productService.jsx';

// Asset imports (as per your original code)
import carousel1 from "../assets/carousel1.jpeg";
import carousel2 from "../assets/carousel2.jpeg";
import carousel3 from "../assets/carousel3.png";
import carousel4 from "../assets/carousel4.png";

const Home = () => {
  console.log('Home component rendering...');
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Home component mounted');
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      
      // Use mock data for now - backend has issues
      const mockFlashSaleProducts = [
        {
          _id: 'flash-1',
          name: 'Car Side View Mirror',
          price: 120,
          oldPrice: 149,
          discount: 20,
          rating: 4.5,
          image: '/assets/default-part.jpg',
          reviews: 88,
        },
        {
          _id: 'flash-2',
          name: 'Car Brake Pads',
          price: 85,
          oldPrice: 100,
          discount: 15,
          rating: 4.2,
          image: '/assets/default-part.jpg',
          reviews: 75,
        },
        {
          _id: 'flash-3',
          name: 'LED Headlight Kit',
          price: 150,
          oldPrice: 189,
          discount: 21,
          rating: 4.7,
          image: '/assets/default-part.jpg',
          reviews: 124,
        },
        {
          _id: 'flash-4',
          name: 'Car Battery',
          price: 200,
          oldPrice: 250,
          discount: 20,
          rating: 4.6,
          image: '/assets/default-part.jpg',
          reviews: 203,
        }
      ];

      const mockExploreProducts = [
        {
          _id: 'explore-1',
          name: 'Engine Oil Filter',
          price: 25,
          rating: 4.8,
          image: '/assets/default-part.jpg',
          reviews: 156,
        },
        {
          _id: 'explore-2',
          name: 'Spark Plugs',
          price: 35,
          rating: 4.0,
          image: '/assets/default-part.jpg',
          reviews: 42,
        },
        {
          _id: 'explore-3',
          name: 'Air Filter',
          price: 18,
          rating: 4.3,
          image: '/assets/default-part.jpg',
          reviews: 89,
        },
        {
          _id: 'explore-4',
          name: 'Windshield Wipers',
          price: 22,
          rating: 4.1,
          image: '/assets/default-part.jpg',
          reviews: 67,
        }
      ];

      setFlashSaleProducts(mockFlashSaleProducts);
      setExploreProducts(mockExploreProducts);
      setLoading(false);
      
    } catch (err) {
      console.error('Error setting up home page data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && flashSaleProducts.length === 0 && exploreProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="ml-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>{error}</span>
          <button 
            className="btn btn-sm btn-ghost ml-4" 
            onClick={fetchHomePageData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-content">
      {/* 1. TOP SECTION: Categories Sidebar + Carousel/Hero */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex">
          {/* 1a. Category Sidebar (Left-hand menu) */}
          {/* Hides on small screens, occupies 20% width on large screens */}
          <div className="hidden lg:block w-1/5 pr-8">
            <CategorySidebar />
          </div>

          {/* 1b. Main Hero Carousel */}
          <div className="w-full lg:w-4/5">
            <Carousel
              images={[
                {
                  src: carousel1,
                  alt: "AI-Powered Part Search Banner",
                  caption: {
                    title: "Heavy Duty High Performance Battery",
                    description:
                      "Guaranteed stronger backup with long term battery health.",
                  },
                },
                {
                  src: carousel3,
                  alt: "Flash Sale on Auto Components",
                  caption: {
                    title: "Advanced Hydraulic Shock Absorber",
                    description: "Absorbs impact. Controls motion. Extends ride comfort",
                  },       
                },
                {
                  src: carousel2,
                  alt: "Flash Sale on Auto Components",
                  caption: {
                    title: "Complete Wheel Solutions",
                    description: "Everything your ride needs to stay rolling",
                  },
                },
                {
                  src: carousel4,
                  alt: "Flash Sale on Auto Components",
                  caption: {
                    title: "Next-Gen LED Headlight Absorber",
                    description: "Engineered to absorb impact and amplify illumination",
                  },
                }
              ]}
            />
          </div>
        </div>
      </div>

      {/* 2. CRITICAL: AI Vehicle Selector / Search Bar */}
      {/* This is positioned just below header, often layered slightly over carousel. */}
      {/* We place it outside container to allow for full-width styling if needed. */}
      <div className="container mx-auto px-4 mt-3 relative z-10">
        <AiVehicleSelector />
      </div>

      {/* 3. FLASH SALES SECTION (Today's Deals) */}
      <div className="container mx-auto px-4 mt-12">
        <ProductGridSection
          title="Today's Flash Sales"
          products={flashSaleProducts}
          showTimer={true}
          sectionLink="/shop?sale=flash"
        />
      </div>

      {/* 4. MID-PAGE BANNER (e.g., Battery/Extreme Weather Ad) */}
      <div className="my-16">
        {/* This component will span the full width of the viewport */}
        <FullWidthBanner
          image="/assets/titaniumx-battery-banner.jpg"
          alt="Extreme Weather Battery Ad"
          // Other props for text overlay
        />
      </div>

      {/* 5. EXPLORE PRODUCTS GRID (Based on second product row in your image) */}
      <div className="container mx-auto px-4 mt-12">
        <ProductGridSection
          title="Explore All Products"
          products={exploreProducts}
          sectionLink="/shop"
        />
      </div>

      {/* 6. NEW ARRIVAL/PROMOTIONAL SECTION */}
      <div className="container mx-auto px-4 my-16">
        <h2 className="text-2xl font-bold mb-6 text-red-600 border-b-2 border-red-600 pb-1 w-fit">
          Featured & New Arrival
        </h2>
        {/* The design shows a specific two-column structure here: 
                   1. Future Engine Ad (Large) 
                   2. Shop Speakers/Air Freshener (Small Columns) 
                   This is often best handled by a custom component like PromosGrid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Placeholder for main promotional image */}
          <FullWidthBanner
            image="/assets/future-engine-ad.jpg"
            alt="The Future Engine Is Coming"
            className="h-96"
          />
          {/* Placeholder for two smaller items */}
          <div className="grid grid-cols-1 gap-6">
            <FullWidthBanner
              image="/assets/speakers-promo.jpg"
              alt="Shop Speakers"
              className="h-44"
            />
            <FullWidthBanner
              image="/assets/air-freshener-promo.jpg"
              alt="Shop Car Perfumes"
              className="h-44"
            />
          </div>
        </div>
      </div>

      {/* 7. SERVICE BAR (Free Delivery, Support, Guarantee) */}
      <div className="container mx-auto px-4 my-16 border-t border-b border-gray-200 py-10">
        <ServiceInfoBar />
      </div>
    </div>
  );
};

export default Home;