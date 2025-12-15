import React from 'react';
import ProductCard from './ProductCard'; 

// --- Placeholder Data ---
const mockRelatedProducts = [
    { id: 401, name: "Premium Coil Spring Set", price: 150, oldPrice: 175, discount: 15, rating: 4.2, image: '/assets/product-springs.jpg', reviews: 45, type: 'Suspension' },
    { id: 402, name: "Strut Mount Kit (Pair)", price: 85, oldPrice: 99, discount: 14, rating: 4.5, image: '/assets/product-strut.jpg', reviews: 78, type: 'Suspension' },
    { id: 403, name: "Adjustable Sway Bar Link", price: 45, oldPrice: 50, discount: 10, rating: 4.8, image: '/assets/product-link.jpg', reviews: 120, type: 'Suspension' },
    { id: 404, name: "Polyurethane Bushing Set", price: 110, oldPrice: null, discount: 0, rating: 4.6, image: '/assets/product-bushings.jpg', reviews: 95, type: 'Suspension' },
];

const RelatedProducts = ({ category }) => {
    // In a real app, you would fetch products based on the 'category' prop
    const products = mockRelatedProducts.filter(p => p.type === category);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-3xl font-extrabold text-gray-900 border-b-2 border-red-600 pb-2 mb-8">
                Customers Also Viewed
            </h2>

            {/* Product Grid - uses the same responsive grid layout as the homepage */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products.map(product => (
                    // We reuse the ProductCard component here
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;