import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import productService from '../../services/productService';
import ProductCard from '../../Components/ProductCard';

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
  }
};

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
        console.log(`Added ${quantity} ${product.name}(s) to cart!`);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 99)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-slate-200 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded-xl w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded-xl w-1/2"></div>
              <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
              <div className="h-24 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Product Not Found</h1>
          <p className="text-slate-600 mb-8">The product you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/shop')}
            className="btn-premium hover:scale-105 active:scale-95"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <ol className="flex items-center space-x-2">
          <li><a href="/" className="text-slate-500 hover:text-slate-700 transition-colors">Home</a></li>
          <li><span className="text-slate-400">/</span></li>
          <li><a href="/shop" className="text-slate-500 hover:text-slate-700 transition-colors">Shop</a></li>
          <li><span className="text-slate-400">/</span></li>
          <li className="text-slate-900 font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
        {/* Product Images */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="aspect-square bg-slate-50 rounded-3xl overflow-hidden shadow-soft">
            <div className="relative w-full h-full">
              {!imagesLoaded.has(0) && (
                <div className="skeleton absolute inset-0"></div>
              )}
              <img 
                src={imagesLoaded.has(0) 
                  ? (product.image && product.image.startsWith('http') ? product.image : product.image ? `http://localhost:5000${product.image}` : '/assets/default-part.jpg')
                  : ''}
                alt={product.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
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

          {/* Thumbnail Gallery */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 justify-center">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'border-brand shadow-soft scale-105' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="relative w-full h-full">
                    {!imagesLoaded.has(index) && (
                      <div className="skeleton absolute inset-0"></div>
                    )}
                    <img 
                      src={imagesLoaded.has(index) 
                        ? (image && image.startsWith('http') ? image : image ? `http://localhost:5000${image}` : '/assets/default-part.jpg')
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

        {/* Product Details & Sticky Sidebar */}
        <div className="space-y-8">
          {/* Product Title & Basic Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600">Brand: <span className="font-medium text-slate-800">{product.brand}</span></p>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  ৳{product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-xl text-slate-400 line-through">
                    ৳{product.oldPrice}
                  </span>
                )}
              </div>
              {product.discount && (
                <div className="inline-block">
                  <span className="badge-minimal">
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`status-dot ${
                (product.stock || 0) > 10 
                  ? 'in-stock' 
                  : (product.stock || 0) > 0 
                    ? 'low-stock'
                    : 'out-of-stock'
              }`}></div>
              <span className="text-sm font-medium text-slate-600">
                {(product.stock || 0) > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="sticky top-24 premium-card p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <span className="text-slate-600 font-semibold">−</span>
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <span className="text-slate-600 font-semibold">+</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="btn-premium w-full hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                  disabled={isInCart(product._id) || (product.stock || 0) === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {isInCart(product._id) ? `In Cart (${getItemQuantity(product._id)})` : 'Add to Cart'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate('/cart')}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-300"
                  >
                    View Cart
                  </button>
                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-slate-600">Free shipping on orders over ৳10,000</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm text-slate-600">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <span className="text-sm text-slate-600">Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Product Features */}
          {product.features && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Features</h3>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 text-emerald-600 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mb-16">
        <div className="premium-card overflow-hidden">
          {/* Tab Headers */}
          <div className="border-b border-slate-200">
            <div className="flex">
              {['description', 'specifications', 'compatibility'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-semibold capitalize transition-all duration-300 relative ${
                    activeTab === tab
                      ? 'text-brand'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand animate-slide-up"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Product Description</h3>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && product.specifications && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Specifications</h3>
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-slate-100 last:border-0">
                      <dt className="text-sm font-semibold text-slate-600 capitalize">{key}</dt>
                      <dd className="text-sm text-slate-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === 'compatibility' && product.compatibility && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Vehicle Compatibility</h3>
                <ul className="space-y-3">
                  {product.compatibility.map((vehicle, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3 9-9m-6 3.75h9m-9 0v-9m0 9L3.75 12.75" />
                        </svg>
                      </div>
                      <span className="text-slate-700">{vehicle}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {getRelatedProducts(product._id, product.category).length > 0 && (
        <div className="mt-16 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-brand rounded-full"></div>
              <span className="text-sm font-semibold uppercase tracking-widest text-brand/70">
                You might also like
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {getRelatedProducts(product._id, product.category).map((relatedProduct) => (
              <ProductCard 
                key={relatedProduct._id} 
                product={relatedProduct} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}