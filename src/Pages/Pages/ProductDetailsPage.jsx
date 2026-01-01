import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';

// Mock product data
const mockProducts = {
  '1': {
    _id: '1',
    name: 'Car Side View Mirror',
    brand: 'AutoVision',
    category: 'Mirrors',
    price: 120,
    oldPrice: 149,
    discount: 20,
    rating: 4.5,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 88,
    stock: 50,
    description: 'High quality side view mirror with anti-glare coating. This side view mirror provides excellent visibility and reduces glare from headlights at night. Features include:\n\n• High-clarity glass with anti-glare coating\n• Adjustable mirror angles\n• Easy installation\n• Durable construction\n• Weather resistant\n• UV protection\n\nPerfect for daily driving and highway conditions.',
    features: ['Anti-glare coating', 'Adjustable angles', 'Easy installation', 'Weather resistant'],
    specifications: {
      'Material': 'High-quality glass and plastic',
      'Dimensions': '12" x 8"',
      'Weight': '1.5 lbs',
      'Color': 'Black',
      'Warranty': '1 Year'
    },
    compatibility: ['Toyota Camry 2015-2022', 'Honda Accord 2016-2022', 'Nissan Altima 2015-2022']
  },
  '2': {
    _id: '2',
    name: 'Car Brake Pads',
    brand: 'BrakeMaster',
    category: 'Brakes',
    price: 85,
    oldPrice: 100,
    discount: 15,
    rating: 4.2,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 75,
    stock: 30,
    description: 'Premium ceramic brake pads for superior stopping power. These brake pads provide excellent performance in all weather conditions.',
    features: ['Ceramic compound', 'Low dust', 'Quiet operation', 'Long lifespan'],
    specifications: {
      'Material': 'Ceramic',
      'Thickness': '12mm',
      'Warranty': '2 Years'
    }
  },
  '3': {
    _id: '3',
    name: 'Engine Oil Filter',
    brand: 'FilterPro',
    category: 'Filters',
    price: 25,
    rating: 4.8,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 156,
    stock: 100,
    description: 'High-efficiency oil filter for maximum engine protection.',
    features: ['High-efficiency filtration', 'Easy installation', 'Durable construction'],
    specifications: {
      'Material': 'High-quality filter paper',
      'Dimensions': '3" x 4"',
      'Warranty': '1 Year'
    }
  },
  '4': {
    _id: '4',
    name: 'Spark Plugs',
    brand: 'IgnitionTech',
    category: 'Ignition',
    price: 35,
    rating: 4.0,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 42,
    stock: 75,
    description: 'Iridium spark plugs for improved fuel efficiency and better engine performance. These spark plugs provide superior ignition and longer service life.',
    features: ['Iridium tip', 'Improved fuel efficiency', 'Long service life', 'Better ignition'],
    specifications: {
      'Material': 'Iridium',
      'Type': 'Resistor',
      'Heat Range': '5',
      'Warranty': '2 Years'
    }
  },
  '5': {
    _id: '5',
    name: 'LED Headlight Kit',
    brand: 'BrightLight',
    category: 'Lighting',
    price: 150,
    oldPrice: 189,
    discount: 21,
    rating: 4.7,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 124,
    stock: 25,
    description: 'Ultra-bright LED headlight conversion kit for superior visibility. This kit provides modern LED technology with enhanced brightness and longer lifespan compared to traditional halogen bulbs.',
    features: ['Ultra-bright LEDs', 'Long lifespan', 'Easy installation', 'Enhanced visibility'],
    specifications: {
      'Technology': 'LED',
      'Lumens': '6000 per bulb',
      'Color Temperature': '6000K (White)',
      'Voltage': '12V',
      'Warranty': '3 Years'
    }
  },
  '6': {
    _id: '6',
    name: 'Car Battery',
    brand: 'PowerCell',
    category: 'Electrical',
    price: 200,
    oldPrice: 250,
    discount: 20,
    rating: 4.6,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 203,
    stock: 15,
    description: 'Heavy duty automotive battery with 3-year warranty. This battery provides reliable starting power in all weather conditions and features advanced technology for extended life.',
    features: ['Heavy duty construction', '3-year warranty', 'All weather performance', 'Maintenance-free'],
    specifications: {
      'Type': 'Lead-Acid AGM',
      'Voltage': '12V',
      'Cold Cranking Amps': '650',
      'Reserve Capacity': '120 minutes',
      'Warranty': '3 Years'
    }
  },
  '7': {
    _id: '7',
    name: 'Air Filter',
    brand: 'FilterPro',
    category: 'Filters',
    price: 18,
    rating: 4.3,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 89,
    stock: 120,
    description: 'High-performance air filter for clean engine intake. This filter removes dust, pollen, and other contaminants to protect your engine and improve performance.',
    features: ['High-performance filtration', 'Improved engine protection', 'Easy to replace', 'Cost-effective'],
    specifications: {
      'Material': 'Synthetic media',
      'Dimensions': '8" x 6" x 2"',
      'Filtration Efficiency': '99.5%',
      'Warranty': '1 Year'
    }
  },
  '8': {
    _id: '8',
    name: 'Windshield Wipers',
    brand: 'ClearView',
    category: 'Wipers',
    price: 22,
    rating: 4.1,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 67,
    stock: 85,
    description: 'All-season windshield wiper blades for clear visibility. These wipers provide streak-free cleaning in all weather conditions.',
    features: ['All-season performance', 'Streak-free cleaning', 'Easy installation', 'Durable construction'],
    specifications: {
      'Type': 'Beam blade',
      'Length': '22 inches',
      'Material': 'Natural rubber',
      'Connectors': 'Universal',
      'Warranty': '6 Months'
    }
  },
  '9': {
    _id: '9',
    name: 'Shock Absorbers',
    brand: 'RideControl',
    category: 'Suspension',
    price: 180,
    oldPrice: 220,
    discount: 18,
    rating: 4.4,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 91,
    stock: 20,
    description: 'Advanced hydraulic shock absorbers for smooth ride quality. These shocks improve handling and provide comfort on various road conditions.',
    features: ['Advanced hydraulic design', 'Smooth ride quality', 'Improved handling', 'Durable construction'],
    specifications: {
      'Type': 'Twin-tube hydraulic',
      'Finish': 'Black powder coat',
      'Mounting Type': 'Eyelet/Eyelet',
      'Extended Length': '16.5 inches',
      'Warranty': '2 Years'
    }
  },
  '10': {
    _id: '10',
    name: 'Alternator',
    brand: 'PowerGen',
    category: 'Electrical',
    price: 320,
    rating: 4.8,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 78,
    stock: 12,
    description: 'High-output alternator for reliable electrical power. This alternator provides maximum charging capacity for all vehicle electrical systems.',
    features: ['High output charging', 'Reliable performance', 'Cooling system', 'Easy installation'],
    specifications: {
      'Output': '150 Amps',
      'Voltage': '12V',
      'Pulley Type': 'Serpentine',
      'Cooling': 'Internal fan',
      'Warranty': '2 Years'
    }
  },
  '11': {
    _id: '11',
    name: 'Radiator',
    brand: 'CoolFlow',
    category: 'Cooling',
    price: 280,
    oldPrice: 350,
    discount: 20,
    rating: 4.5,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 156,
    stock: 18,
    description: 'High-performance aluminum radiator for efficient engine cooling. This radiator provides superior heat dissipation for optimal engine temperature.',
    features: ['High-performance aluminum', 'Efficient cooling', 'Durable construction', 'Lightweight design'],
    specifications: {
      'Material': 'Aluminum',
      'Core Type': 'Multi-tube',
      'Tank Material': 'Plastic',
      'Overall Dimensions': '28" x 17" x 2"',
      'Warranty': '3 Years'
    }
  },
  '12': {
    _id: '12',
    name: 'Brake Rotors',
    brand: 'BrakeMaster',
    category: 'Brakes',
    price: 95,
    rating: 4.6,
    image: '/assets/default-part.jpg',
    images: ['/assets/default-part.jpg'],
    reviews: 103,
    stock: 45,
    description: 'Cross-drilled brake rotors for better cooling and performance. These rotors provide superior stopping power and reduced brake fade.',
    features: ['Cross-drilled design', 'Better cooling', 'Reduced brake fade', 'Superior stopping power'],
    specifications: {
      'Material': 'Cast iron',
      'Surface Finish': 'Cross-drilled and slotted',
      'Thickness': '28mm',
      'Diameter': '12 inches',
      'Warranty': '2 Years'
    }
  }
};

const mockReviews = [
  {
    _id: '1',
    user: 'John D.',
    rating: 5,
    title: 'Excellent Quality',
    content: 'Great product! Easy to install and works perfectly.',
    date: '2024-01-15',
    helpful: 23
  },
  {
    _id: '2',
    user: 'Sarah M.',
    rating: 4,
    title: 'Good Value',
    content: 'Product as described. Good quality for the price.',
    date: '2024-01-10',
    helpful: 12
  },
  {
    _id: '3',
    user: 'Mike R.',
    rating: 5,
    title: 'Perfect Fit',
    content: 'Fitted perfectly on my car. Highly recommend!',
    date: '2024-01-05',
    helpful: 8
  }
];

// Dynamic related products based on current product
const getRelatedProducts = (currentProductId, currentCategory) => {
  const allProducts = Object.values(mockProducts);
  return allProducts
    .filter(p => p._id !== currentProductId && p.category === currentCategory)
    .slice(0, 4);
};

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(productId);
        setProduct(response.product || response);
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        
        // Fallback to mock data
        const foundProduct = mockProducts[productId];
        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
        } else {
          setError('Product not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product, quantity);
        // Show success message - use a better notification than alert
        console.log(`Added ${quantity} ${product.name}(s) to cart!`);
        // Optional: Add a toast notification here
      } catch (error) {
        console.error('Failed to add to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fas fa-star ${i < Math.floor(rating) ? '' : 'text-gray-300'}`}></i>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">({product?.reviews || 0} reviews)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="btn btn-primary"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-gray-500 hover:text-gray-700">Home</a></li>
          <li><span className="text-gray-400">/</span></li>
          <li><a href="/shop" className="text-gray-500 hover:text-gray-700">Shop</a></li>
          <li><span className="text-gray-400">/</span></li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
              {!imagesLoaded.has(0) && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <img 
                 src={imagesLoaded.has(0) 
                   ? `http://localhost:5000${product.images[selectedImage]}` 
                   : ''}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imagesLoaded.has(0) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImagesLoaded(new Set(imagesLoaded).add(0))}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/default-part.jpg';
                  setImagesLoaded(new Set(imagesLoaded).add(0));
                }}
              />
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <div className="relative w-full h-full">
                    {!imagesLoaded.has(index) && (
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    )}
                    <img 
                      src={imagesLoaded.has(index) 
                        ? `http://localhost:5000${image}` 
                        : ''} 
                      alt={`${product.name} ${index + 1}`} 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${
                        imagesLoaded.has(index) ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImagesLoaded(new Set(imagesLoaded).add(index))}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/default-part.jpg';
                        setImagesLoaded(new Set(imagesLoaded).add(index));
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-500">|</span>
              <span className="text-sm text-gray-600">Brand: {product.brand}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">৳{product.price}</span>
            {product.oldPrice && (
              <span className="text-xl text-gray-500 line-through">৳{product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                -{product.discount}%
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-green-600"></i>
              <span className="text-sm text-gray-600">In Stock ({product.stock} available)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-truck text-blue-600"></i>
              <span className="text-sm text-gray-600">Free shipping on orders over ৳500</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-shield-alt text-purple-600"></i>
              <span className="text-sm text-gray-600">1 Year Warranty</span>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="btn btn-outline btn-sm"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-16 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="btn btn-outline btn-sm"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary flex-1"
                disabled={isInCart(product._id)}
              >
                {isInCart(product._id) ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    In Cart ({getItemQuantity(product._id)})
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Add to Cart
                  </>
                )}
              </button>
              <button className="btn btn-outline">
                <i className="far fa-heart"></i>
              </button>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/cart')}
                className="btn btn-outline flex-1"
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                View Cart
              </button>
              <button 
                onClick={() => navigate('/checkout')}
                className="btn btn-success flex-1"
              >
                <i className="fas fa-credit-card mr-2"></i>
                Checkout Now
              </button>
            </div>
          </div>

          {/* Product Features */}
          {product.features && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <i className="fas fa-check text-green-600 mt-1"></i>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="border-b">
              <div className="flex">
                {['description', 'specifications', 'compatibility', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 text-sm font-medium capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-primary text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && product.specifications && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                  <dl className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="text-sm font-medium text-gray-600">{key}</dt>
                        <dd className="text-sm text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {activeTab === 'compatibility' && product.compatibility && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Compatibility</h3>
                  <ul className="space-y-2">
                    {product.compatibility.map((vehicle, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <i className="fas fa-car text-blue-600"></i>
                        <span className="text-sm text-gray-700">{vehicle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div key={review._id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">{review.user[0]}</span>
                            </div>
                            <div>
                              <p className="font-medium">{review.user}</p>
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star text-xs ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-medium mb-1">{review.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{review.content}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <button className="hover:text-primary">Helpful ({review.helpful})</button>
                          <button className="hover:text-primary">Report</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Brand</dt>
                <dd className="text-sm font-medium">{product.brand}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Category</dt>
                <dd className="text-sm font-medium">{product.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Availability</dt>
                <dd className="text-sm font-medium text-green-600">In Stock</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Shipping</dt>
                <dd className="text-sm font-medium">Free over ৳500</dd>
              </div>
            </dl>
          </div>

          {/* Customer Service */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <i className="fas fa-phone text-blue-600"></i>
                <div>
                  <p className="text-sm font-medium">Call Us</p>
                  <p className="text-xs text-gray-600">+880 1234 567890</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-blue-600"></i>
                <div>
                  <p className="text-sm font-medium">Email Us</p>
                  <p className="text-xs text-gray-600">support@autopartzone.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-comments text-blue-600"></i>
                <div>
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-xs text-gray-600">Available 9AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getRelatedProducts(product._id, product.category).map((relatedProduct) => (
            <div key={relatedProduct._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                 onClick={() => navigate(`/product/${relatedProduct._id}`)}>
              <div className="aspect-square bg-gray-100">
                <img 
                  src={relatedProduct.image} 
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/default-part.jpg';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">৳{relatedProduct.price}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    {relatedProduct.rating}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}