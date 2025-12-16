// --- src/Pages/ShopPage.jsx ---
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../services/productService.jsx';
import ProductCard from '../Components/ProductCard';

const ShopPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pages: 1,
        total: 0,
        limit: 20
    });

    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc',
        inStock: searchParams.get('inStock') !== 'false',
        page: 1,
        limit: 12
    });

    // Fetch categories and brands on mount
    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        fetchProducts();
    }, [filters]);

    // Update URL params when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                params.set(key, value);
            }
        });
        setSearchParams(params);
    }, [filters, setSearchParams]);

    // Mock data
    const mockProducts = [
        {
            _id: '1',
            name: 'Car Side View Mirror',
            brand: 'AutoVision',
            category: 'Mirrors',
            price: 120,
            oldPrice: 149,
            discount: 20,
            rating: 4.5,
            image: '/assets/default-part.jpg',
            reviews: 88,
            stock: 50,
            description: 'High quality side view mirror with anti-glare coating'
        },
        {
            _id: '2',
            name: 'Car Brake Pads',
            brand: 'BrakeMaster',
            category: 'Brakes',
            price: 85,
            oldPrice: 100,
            discount: 15,
            rating: 4.2,
            image: '/assets/default-part.jpg',
            reviews: 75,
            stock: 30,
            description: 'Premium ceramic brake pads for superior stopping power'
        },
        {
            _id: '3',
            name: 'Engine Oil Filter',
            brand: 'FilterPro',
            category: 'Filters',
            price: 25,
            rating: 4.8,
            image: '/assets/default-part.jpg',
            reviews: 156,
            stock: 100,
            description: 'High-efficiency oil filter for maximum engine protection'
        },
        {
            _id: '4',
            name: 'Spark Plugs',
            brand: 'IgnitionTech',
            category: 'Ignition',
            price: 35,
            rating: 4.0,
            image: '/assets/default-part.jpg',
            reviews: 42,
            stock: 75,
            description: 'Iridium spark plugs for improved fuel efficiency'
        },
        {
            _id: '5',
            name: 'LED Headlight Kit',
            brand: 'BrightLight',
            category: 'Lighting',
            price: 150,
            oldPrice: 189,
            discount: 21,
            rating: 4.7,
            image: '/assets/default-part.jpg',
            reviews: 124,
            stock: 25,
            description: 'Ultra-bright LED headlight conversion kit'
        },
        {
            _id: '6',
            name: 'Car Battery',
            brand: 'PowerCell',
            category: 'Electrical',
            price: 200,
            oldPrice: 250,
            discount: 20,
            rating: 4.6,
            image: '/assets/default-part.jpg',
            reviews: 203,
            stock: 15,
            description: 'Heavy duty automotive battery with 3-year warranty'
        },
        {
            _id: '7',
            name: 'Air Filter',
            brand: 'FilterPro',
            category: 'Filters',
            price: 18,
            rating: 4.3,
            image: '/assets/default-part.jpg',
            reviews: 89,
            stock: 120,
            description: 'High-performance air filter for clean engine intake'
        },
        {
            _id: '8',
            name: 'Windshield Wipers',
            brand: 'ClearView',
            category: 'Wipers',
            price: 22,
            rating: 4.1,
            image: '/assets/default-part.jpg',
            reviews: 67,
            stock: 85,
            description: 'All-season windshield wiper blades'
        },
        {
            _id: '9',
            name: 'Shock Absorbers',
            brand: 'RideControl',
            category: 'Suspension',
            price: 180,
            oldPrice: 220,
            discount: 18,
            rating: 4.4,
            image: '/assets/default-part.jpg',
            reviews: 91,
            stock: 20,
            description: 'Advanced hydraulic shock absorbers for smooth ride'
        },
        {
            _id: '10',
            name: 'Alternator',
            brand: 'PowerGen',
            category: 'Electrical',
            price: 320,
            rating: 4.8,
            image: '/assets/default-part.jpg',
            reviews: 78,
            stock: 12,
            description: 'High-output alternator for reliable electrical power'
        },
        {
            _id: '11',
            name: 'Radiator',
            brand: 'CoolFlow',
            category: 'Cooling',
            price: 280,
            oldPrice: 350,
            discount: 20,
            rating: 4.5,
            image: '/assets/default-part.jpg',
            reviews: 156,
            stock: 18,
            description: 'High-performance aluminum radiator'
        },
        {
            _id: '12',
            name: 'Brake Rotors',
            brand: 'BrakeMaster',
            category: 'Brakes',
            price: 95,
            rating: 4.6,
            image: '/assets/default-part.jpg',
            reviews: 103,
            stock: 45,
            description: 'Cross-drilled brake rotors for better cooling'
        }
    ];

    const mockCategories = ['Mirrors', 'Brakes', 'Filters', 'Ignition', 'Lighting', 'Electrical', 'Wipers', 'Suspension', 'Cooling'];
    const mockBrands = ['AutoVision', 'BrakeMaster', 'FilterPro', 'IgnitionTech', 'BrightLight', 'PowerCell', 'ClearView', 'RideControl', 'PowerGen', 'CoolFlow'];

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            // Filter products based on current filters
            let filteredProducts = [...mockProducts];
            
            // Search filter
            if (filters.search) {
                filteredProducts = filteredProducts.filter(product => 
                    product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    product.description.toLowerCase().includes(filters.search.toLowerCase())
                );
            }
            
            // Category filter
            if (filters.category) {
                filteredProducts = filteredProducts.filter(product => product.category === filters.category);
            }
            
            // Brand filter
            if (filters.brand) {
                filteredProducts = filteredProducts.filter(product => product.brand === filters.brand);
            }
            
            // Price range filter
            if (filters.minPrice) {
                filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(filters.minPrice));
            }
            if (filters.maxPrice) {
                filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(filters.maxPrice));
            }
            
            // In stock filter
            if (filters.inStock) {
                filteredProducts = filteredProducts.filter(product => product.stock > 0);
            }
            
            // Sort products
            filteredProducts.sort((a, b) => {
                let aValue, bValue;
                
                switch (filters.sortBy) {
                    case 'price':
                        aValue = a.price;
                        bValue = b.price;
                        break;
                    case 'name':
                        aValue = a.name;
                        bValue = b.name;
                        break;
                    case 'createdAt':
                    default:
                        aValue = parseInt(a._id);
                        bValue = parseInt(b._id);
                        break;
                }
                
                if (typeof aValue === 'string') {
                    return filters.sortOrder === 'asc' 
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                
                return filters.sortOrder === 'asc' 
                    ? aValue - bValue
                    : bValue - aValue;
            });
            
            // Simulate pagination
            const startIndex = (filters.page - 1) * filters.limit;
            const paginatedProducts = filteredProducts.slice(startIndex, startIndex + filters.limit);
            
            setProducts(paginatedProducts);
            setPagination({
                current: filters.page,
                pages: Math.ceil(filteredProducts.length / filters.limit),
                total: filteredProducts.length,
                limit: filters.limit
            });
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            setCategories(mockCategories);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchBrands = async () => {
        try {
            setBrands(mockBrands);
        } catch (err) {
            console.error('Error fetching brands:', err);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            ...(key !== 'page' && { page: 1 }) // Reset to page 1 when filters change
        }));
    };

    const handlePageChange = (page) => {
        handleFilterChange('page', page);
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            inStock: true,
            page: 1
        });
    };

    if (loading && products.length === 0) {
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
                    <span>Error loading products: {error}</span>
                    <button className="btn btn-sm btn-ghost ml-4" onClick={fetchProducts}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="shop-page container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="lg:w-1/4">
                    <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Filters</h2>
                            <button 
                                className="btn btn-sm btn-outline"
                                onClick={clearFilters}
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Search */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Search</label>
                            <input
                                type="text"
                                className="input input-bordered w-full"
                                placeholder="Search products..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {/* Brand Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Brand</label>
                            <select
                                className="select select-bordered w-full"
                                value={filters.brand}
                                onChange={(e) => handleFilterChange('brand', e.target.value)}
                            >
                                <option value="">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Price Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    className="input input-bordered w-1/2"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="input input-bordered w-1/2"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Sort By</label>
                            <select
                                className="select select-bordered w-full"
                                value={`${filters.sortBy}-${filters.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    handleFilterChange('sortBy', sortBy);
                                    handleFilterChange('sortOrder', sortOrder);
                                }}
                            >
                                <option value="createdAt-desc">Newest First</option>
                                <option value="createdAt-asc">Oldest First</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                        </div>

                        {/* In Stock Filter */}
                        <div className="mb-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary mr-2"
                                    checked={filters.inStock}
                                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                />
                                <span className="text-sm">In Stock Only</span>
                            </label>
                        </div>

                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            {pagination.total} products found
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:w-3/4">
                    {/* Results Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">
                            {filters.search ? `Search Results for "${filters.search}"` : 'All Products'}
                        </h1>
                        <div className="text-sm text-gray-600">
                            Showing {products.length} of {pagination.total} products
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard 
                                    key={product._id} 
                                    product={{
                                        ...product,
                                        id: product._id,
                                        image: product.images?.[0] || '/assets/default-part.jpg',
                                        price: product.price,
                                        oldPrice: product.discount ? product.price * (1 + product.discount / 100) : null,
                                        discount: product.discount
                                    }} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-xl font-semibold mb-2">No products found</h3>
                            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* Loading indicator for pagination */}
                    {loading && (
                        <div className="flex justify-center mt-8">
                            <div className="loading loading-spinner loading-md"></div>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="btn-group">
                                <button
                                    className="btn"
                                    disabled={pagination.current === 1}
                                    onClick={() => handlePageChange(pagination.current - 1)}
                                >
                                    Previous
                                </button>
                                
                                {/* Page Numbers */}
                                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            className={`btn ${page === pagination.current ? 'btn-active' : ''}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                <button
                                    className="btn"
                                    disabled={pagination.current === pagination.pages}
                                    onClick={() => handlePageChange(pagination.current + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShopPage;