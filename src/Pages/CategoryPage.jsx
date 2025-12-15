// --- src/Pages/CategoryPage.jsx ---
import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage = () => {
    // This will retrieve the category name from the URL path, e.g., /category/suspension
    const { categoryName } = useParams();
    
    // Capitalize the first letter for display
    const displayName = categoryName 
        ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) 
        : 'Unknown Category';

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
                Shop {displayName}
            </h1>
            <p className="text-lg text-gray-600">
                This page is currently a placeholder. It will eventually display a list of products within the "{displayName}" category.
            </p>
            {/* Future Content: Filters, Sidebar, Product Grid */}
        </div>
    );
};

export default CategoryPage;