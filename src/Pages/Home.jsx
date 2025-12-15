import React from "react";

// Core structural components
import Footer from "../Components/Footer";
import Carousel from "../Components/Carousel";

// Section components based on your design
import CategorySidebar from "../Components/CategorySidebar"; // Left-hand menu
import AiVehicleSelector from "../Components/AiVehicleSelector"; // Search/Selector bar
import ProductGridSection from "../Components/ProductGridSection"; // For 'Flash Sales' and 'Explore'
import FullWidthBanner from "../Components/FullWidthBanner"; // For the Battery/Engine ads
import ServiceInfoBar from "../Components/ServiceInfoBar"; // Bottom delivery/support info

// Asset imports (as per your original code)
import carousel1 from "../assets/carousel1.jpeg";
import carousel2 from "../assets/carousel2.jpeg";
import carousel3 from "../assets/carousel3.png";
import carousel4 from "../assets/carousel4.png";

const Home = () => {
  // --- Placeholder Data ---
  // NOTE: In a real app, this data would be fetched from your backend API
  const flashSaleProducts = [
    {
      id: 1,
      name: "Car Side View Mirror",
      price: 120,
      oldPrice: 149,
      discount: 20,
      rating: 4.5,
      image: "/assets/product1.jpg",
      reviews: 88,
    },
    {
      id: 2,
      name: "Car Home Gadget",
      price: 99,
      oldPrice: 110,
      discount: 10,
      rating: 4.8,
      image: "/assets/product2.jpg",
      reviews: 156,
    },
    {
      id: 3,
      name: "Car Braking Tool Kit",
      price: 170,
      oldPrice: 195,
      discount: 13,
      rating: 4.2,
      image: "/assets/product3.jpg",
      reviews: 75,
    },
    // ... include more products here to fill the grid
  ];

  return (
    <div className="homepage-content pt-19">
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
      {/* This is positioned just below the header, often layered slightly over the carousel. */}
      {/* We place it outside the container to allow for full-width styling if needed. */}
      <div className="container mx-auto px-4 mt-3 relative z-10">
        <AiVehicleSelector />
      </div>

      {/* 3. FLASH SALES SECTION (Today's Deals) */}
      <div className="container mx-auto px-4 mt-12">
        <ProductGridSection
          title="Today's Flash Sales"
          products={flashSaleProducts}
          showTimer={true}
          sectionLink="/flash-sales"
        />
      </div>

      {/* 4. MID-PAGE BANNER (e.g., Battery/Extreme Weather Ad) */}
      <div className="my-16">
        {/* This component will span the full width of the viewport */}
        <FullWidthBanner
          image="/assets/titaniumx-battery-banner.jpg"
          alt="Extreme Weather Battery Ad"
          // Other props for the text overlay
        />
      </div>

      {/* 5. EXPLORE PRODUCTS GRID (Based on the second product row in your image) */}
      <div className="container mx-auto px-4 mt-12">
        <ProductGridSection
          title="Explore All Products"
          products={flashSaleProducts} // Placeholder
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
          {/* Placeholder for the main promotional image */}
          <FullWidthBanner
            image="/assets/future-engine-ad.jpg"
            alt="The Future Engine Is Coming"
            className="h-96"
          />
          {/* Placeholder for the two smaller items */}
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
