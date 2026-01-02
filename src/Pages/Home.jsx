import React, { useState, useEffect } from 'react';
import productService from '../services/productService.jsx';
import BentoHero from '../Components/BentoHero';
import FullWidthBanner from '../Components/FullWidthBanner';
import ServiceInfoBar from '../Components/ServiceInfoBar';
import ProductGridSection from '../Components/ProductGridSection';
import ProductCard from '../Components/ProductCard';

const Home = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [exploreProducts, setExploreProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carousel images
  const carouselImages = [
    {
      src: '/src/assets/carousel1.jpeg',
      alt: 'Premium Auto Parts',
      caption: {
        title: 'Premium Quality Auto Parts',
        description: 'Get the best parts for your vehicle at unbeatable prices'
      }
    },
    {
      src: '/src/assets/carousel2.jpeg',
      alt: 'Fast Delivery',
      caption: {
        title: 'Fast & Free Delivery',
        description: 'Free shipping on orders over ৳140'
      }
    },
    {
      src: '/src/assets/carousel3.png',
      alt: 'Expert Support',
      caption: {
        title: 'Expert Customer Support',
        description: '24/7 assistance for all your automotive needs'
      }
    },
    {
      src: '/src/assets/carousel4.png',
      alt: 'Special Offers',
      caption: {
        title: 'Special Offers',
        description: 'Limited time deals on premium parts'
      }
    }
  ];

  // Mock data for fallback
  const mockFlashSaleProducts = [
    {
      id: '1',
      _id: '1',
      name: 'Car Brake Pads',
      brand: 'BrakeMaster',
      category: 'Brakes',
      price: 80,
      oldPrice: 100,
      discount: 20,
      rating: 4.5,
      image: '/src/assets/brake-pad.jpg',
      reviews: 128,
      stock: 45,
      description: 'Premium ceramic brake pads for superior stopping power'
    },
    {
      id: '2',
      _id: '2',
      name: 'Piston Ring',
      brand: 'EnginePro',
      category: 'Engine',
      price: 200,
      oldPrice: 250,
      discount: 20,
      rating: 4.7,
      image: '/src/assets/default-part.jpg',
      reviews: 89,
      stock: 30,
      description: 'High-performance piston rings for optimal engine compression'
    },
    {
      id: '3',
      _id: '3',
      name: 'Pivot Pin',
      brand: 'SuspensionTech',
      category: 'Suspension',
      price: 180,
      oldPrice: 220,
      discount: 18,
      rating: 4.3,
      image: '/src/assets/default-part.jpg',
      reviews: 56,
      stock: 25,
      description: 'Durable pivot pins for smooth suspension movement'
    },
    {
      id: '4',
      _id: '4',
      name: 'Performance Clutch Kit',
      brand: 'ClutchMaster',
      category: 'Transmission',
      price: 220,
      oldPrice: 280,
      discount: 21,
      rating: 4.6,
      image: '/src/assets/default-part.jpg',
      reviews: 94,
      stock: 18,
      description: 'Complete performance clutch kit for enhanced driving experience'
    }
  ];

  const mockExploreProducts = [
    {
      id: '5',
      _id: '5',
      name: 'Engine Oil Filter',
      brand: 'FilterPro',
      category: 'Filters',
      price: 25,
      rating: 4.8,
      image: '/src/assets/default-part.jpg',
      reviews: 156,
      stock: 100,
      description: 'High-efficiency oil filter for maximum engine protection'
    },
    {
      id: '6',
      _id: '6',
      name: 'Shock Absorbers',
      brand: 'RideControl',
      category: 'Suspension',
      price: 180,
      oldPrice: 220,
      discount: 18,
      rating: 4.4,
      image: '/src/assets/default-part.jpg',
      reviews: 91,
      stock: 20,
      description: 'Advanced hydraulic shock absorbers for smooth ride'
    },
    {
      id: '7',
      _id: '7',
      name: 'LED Headlight Kit',
      brand: 'BrightLight',
      category: 'Lighting',
      price: 150,
      oldPrice: 189,
      discount: 21,
      rating: 4.7,
      image: '/src/assets/default-part.jpg',
      reviews: 124,
      stock: 25,
      description: 'Ultra-bright LED headlight conversion kit'
    },
    {
      id: '8',
      _id: '8',
      name: 'Spark Plugs',
      brand: 'IgnitionTech',
      category: 'Ignition',
      price: 35,
      rating: 4.0,
      image: '/src/assets/default-part.jpg',
      reviews: 42,
      stock: 75,
      description: 'Iridium spark plugs for improved fuel efficiency'
    },
    {
      id: '9',
      _id: '9',
      name: 'Air Filter',
      brand: 'FilterPro',
      category: 'Filters',
      price: 18,
      rating: 4.3,
      image: '/src/assets/default-part.jpg',
      reviews: 89,
      stock: 120,
      description: 'High-performance air filter for clean engine intake'
    },
    {
      id: '10',
      _id: '10',
      name: 'Car Battery',
      brand: 'PowerCell',
      category: 'Electrical',
      price: 200,
      oldPrice: 250,
      discount: 20,
      rating: 4.6,
      image: '/src/assets/default-part.jpg',
      reviews: 203,
      stock: 15,
      description: 'Heavy duty automotive battery with 3-year warranty'
    },
    {
      id: '11',
      _id: '11',
      name: 'Windshield Wipers',
      brand: 'ClearView',
      category: 'Wipers',
      price: 22,
      rating: 4.1,
      image: '/src/assets/default-part.jpg',
      reviews: 67,
      stock: 85,
      description: 'All-season windshield wiper blades'
    },
    {
      id: '12',
      _id: '12',
      name: 'Car Side View Mirror',
      brand: 'AutoVision',
      category: 'Mirrors',
      price: 120,
      oldPrice: 150,
      discount: 20,
      rating: 4.2,
      image: '/src/assets/default-part.jpg',
      reviews: 78,
      stock: 35,
      description: 'Adjustable side view mirror with anti-glare coating'
    }
  ];

  // Fetch categories and brands on mount
  useEffect(() => {
    console.log('Home component mounted');
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      
      // Fetch real data from API
      const [flashSaleResponse, exploreResponse] = await Promise.all([
        productService.getFeaturedProducts('flash-sale'),
        productService.getProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' })
      ]);
      
      // Process flash sale products
      if (flashSaleResponse && flashSaleResponse.products && flashSaleResponse.products.length > 0) {
        setFlashSaleProducts(flashSaleResponse.products.map(p => ({
          ...p,
          id: p._id,
          image: p.images?.[0] ? `http://localhost:5000/uploads/products/${p.images[0].split('/').pop()}` : '/src/assets/default-part.jpg',
          oldPrice: p.discount ? p.price * (1 + p.discount / 100) : null
        })));
      } else {
        // If no flash sale products, get available products with stock instead of mock data
        try {
          const fallbackResponse = await productService.getProducts({ 
            limit: 4, 
            inStock: true, 
            sortBy: 'createdAt', 
            sortOrder: 'desc' 
          });
          if (fallbackResponse && fallbackResponse.products && fallbackResponse.products.length > 0) {
            setFlashSaleProducts(fallbackResponse.products.map(p => ({
              ...p,
              id: p._id,
              image: p.images?.[0] ? `http://localhost:5000/uploads/products/${p.images[0].split('/').pop()}` : '/src/assets/default-part.jpg',
              oldPrice: p.discount ? p.price * (1 + p.discount / 100) : null
            })));
          } else {
            setFlashSaleProducts([]);
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch failed:', fallbackErr);
          setFlashSaleProducts([]);
        }
      }
      
      // Process explore products
      if (exploreResponse && exploreResponse.products && exploreResponse.products.length > 0) {
        setExploreProducts(exploreResponse.products.map(p => ({
          ...p,
          id: p._id,
          image: p.images?.[0] ? `http://localhost:5000/uploads/products/${p.images[0].split('/').pop()}` : '/src/assets/default-part.jpg',
          oldPrice: p.discount ? p.price * (1 + p.discount / 100) : null
        })));
      } else {
        // If no explore products, try to get any available products
        try {
          const fallbackResponse = await productService.getProducts({ 
            limit: 8, 
            inStock: true 
          });
          if (fallbackResponse && fallbackResponse.products && fallbackResponse.products.length > 0) {
            setExploreProducts(fallbackResponse.products.map(p => ({
              ...p,
              id: p._id,
              image: p.images?.[0] ? `http://localhost:5000/uploads/products/${p.images[0].split('/').pop()}` : '/src/assets/default-part.jpg',
              oldPrice: p.discount ? p.price * (1 + p.discount / 100) : null
            })));
          } else {
            setExploreProducts([]);
          }
        } catch (fallbackErr) {
          console.error('Explore fallback fetch failed:', fallbackErr);
          setExploreProducts([]);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching home page data:', err);
      setError(err.message);
      setFlashSaleProducts([]);
      setExploreProducts([]);
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Bento Hero Section */}
      <BentoHero />

      {/* Service Info Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ServiceInfoBar />
      </div>

      {/* Flash Sale Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridSection 
          title="Flash Sale" 
          products={flashSaleProducts}
          showTimer={true}
          sectionLink="/shop?category=flash-sale"
        />
      </div>

      {/* Full Width Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FullWidthBanner 
          image="/src/assets/car_transparent.gif"
          alt="Auto Parts Banner"
          className="h-64"
          title="Premium Auto Parts"
          subtitle="Quality parts for every vehicle"
        />
      </div>

      {/* Explore Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductGridSection 
          title="Explore Products" 
          products={exploreProducts}
          showTimer={false}
          sectionLink="/shop"
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      )}
    </div>
  );
};

export default Home;