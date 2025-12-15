// --- src/Pages/ProductDetailsPage.jsx ---
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailsPage = () => {
    // This hook pulls the ID from the URL path: /product/1 -> productId = 1
    const { productId } = useParams();

    return (
        <div className="container mx-auto px-4 py-20 min-h-[calc(100vh-200px)]">
            <div className="text-center p-10 border border-red-300 bg-red-50 rounded-lg">
                <h1 className="text-4xl font-extrabold text-gray-800">
                    Product Details Page
                </h1>
                <p className="text-2xl mt-4 text-red-600">
                    SUCCESS! This page is now loaded.
                </p>
                <p className="text-xl mt-4 text-gray-700">
                    Viewing Product ID: <span className="font-mono bg-red-100 p-1 rounded-md text-gray-900 font-bold">{productId}</span>
                </p>
            </div>
            
            {/* The rest of the details page content will go here */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 shadow rounded-lg h-96">
                    <h2 className="text-2xl font-bold">Image Gallery & Main Info Area</h2>
                    <p className="text-gray-500">Placeholder for images, description, fitment checker, and price details.</p>
                </div>
                <div className="bg-white p-6 shadow rounded-lg h-96">
                    <h2 className="text-2xl font-bold">Add to Cart & Shipping Info</h2>
                    <p className="text-gray-500">Placeholder for cart quantity, purchase button, and delivery estimates.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;