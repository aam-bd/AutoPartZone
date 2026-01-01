// --- src/Pages/CategoryPage.jsx ---
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const { isInCart } = useCart();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');

    // Capitalize the first letter for display
    const displayName = categoryName 
        ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace(/-/g, ' ') 
        : 'Unknown Category';

    useEffect(() => {
        fetchCategoryProducts();
    }, [categoryName, sortBy, sortOrder]);

    const fetchCategoryProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getProducts({
                category: categoryName,
                sortBy,
                sortOrder,
                limit: 50
            });
            
            setProducts(response.products || []);
        } catch (err) {
            setError('Failed to load category products');
            console.error('Category products error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSortChange = (newSortBy) => {
        if (newSortBy === sortBy) {
            // Toggle sort order if same column
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc'); // Reset to desc for new column
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

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="alert alert-error">
                    <span>{error}</span>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="btn btn-sm btn-ghost ml-4"
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-4xl font-extrabold text-gray-900">
                        Shop {displayName}
                    </h1>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="btn btn-outline"
                    >
                        Back to All Products
                    </button>
                </div>
                
                <p className="text-lg text-gray-600 mb-4">
                    {products.length} {products.length === 1 ? 'product' : 'products'} found in {displayName}
                </p>

                {/* Sort Controls */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <div className="flex gap-2">
                        {[
                            { key: 'createdAt', label: 'Newest' },
                            { key: 'price', label: 'Price' },
                            { key: 'name', label: 'Name' },
                            { key: 'stock', label: 'Stock' }
                        ].map(sort => (
                            <button
                                key={sort.key}
                                onClick={() => handleSortChange(sort.key)}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    sortBy === sort.key
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                                }`}
                            >
                                {sort.label}
                                {sortBy === sort.key && (
                                    <span className="ml-1">
                                        {sortOrder === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product._id} 
                            product={product}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">
                        We couldn't find any products in the {displayName} category.
                    </p>
                    <button 
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary"
                    >
                        Browse All Products
                    </button>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;