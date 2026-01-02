import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import RelatedProducts from '../Components/RelatedProducts';


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

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
    }
  };

  const relatedProducts = [
    {
      _id: '3',
      name: 'Engine Oil Filter',
      brand: 'FilterPro',
      category: 'Filters',
      price: 25,
      rating: 4.8,
      image: '/assets/default-part.jpg',
      reviews: 156
    },
    {
      _id: '4',
      name: 'Spark Plugs',
      brand: 'IgnitionTech',
      category: 'Ignition',
      price: 35,
      rating: 4.0,
      image: '/assets/default-part.jpg',
      reviews: 42
    }
  ];

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
    }
  ];

  useEffect(() => {
    // Simulate loading product data
    setTimeout(() => {
      const foundProduct = mockProducts[id] || mockProducts['1']; // Default to product 1 if not found
      setProduct(foundProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
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
        <div className="alert alert-error max-w-2xl mx-auto">
          <span>{error || 'Product not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={product.images[selectedImage] 
                 ? `http://localhost:5000${product.images[selectedImage]}` 
                 : '/assets/default-part.jpg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
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
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
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
              <span className="text-sm text-gray-600">Brand: {product.brand}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">৳{product.price}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-box text-green-600"></i>
              <span className="text-sm text-gray-600">In Stock ({product.stock} available)</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-truck text-blue-600"></i>
              <span className="text-sm text-gray-600">Free shipping on orders over ৳10,000</span>
            </div>
          </div>

          <div className="space-y-4">
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
                <span className="w-12 text-center font-semibold">{quantity}</span>
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
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                Add to Cart
              </button>
              <button className="btn btn-outline">
                <i className="far fa-heart"></i>
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

      {/* Product Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Product Description</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            {product.specifications && (
              <dl className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-600">{key}</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>



      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relatedProduct => (
            <ProductCard 
              key={relatedProduct._id} 
              product={relatedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}