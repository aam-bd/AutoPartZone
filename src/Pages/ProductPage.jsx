import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import RelatedProducts from '../Components/RelatedProducts';
import productService from '../services/productService.jsx';


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Fetch the specific product by ID
      const response = await productService.getProductById(id);
      console.log('Raw API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      
      const productData = response.product || response;
      console.log('Product data:', productData);
      console.log('Product images:', productData.images);
      
      setProduct(productData);
      setReviews(response.reviews || []);
      
      // Fetch related products (same category)
      if ((productData?.category)) {
        const relatedRes = await productService.getProducts({
          category: productData.category,
          limit: 4
        });
        setRelatedProducts(relatedRes.products || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/default-part.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

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

  console.log('Rendering ProductPage with product:', product);
  console.log('Product images array:', product.images);
  const mainImageUrl = getImageUrl(product.images?.[selectedImage]);
  console.log('Main image URL:', mainImageUrl);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={mainImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={getImageUrl(image)}
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
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