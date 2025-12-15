// --- src/Pages/ShopPage.jsx ---
import React from 'react';

const ShopPage = () => {
    return (
        <div className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-200px)]">
            <h1 className="text-4xl font-bold text-gray-800">Shop Page</h1>
            <p className="text-xl mt-4 text-gray-600">
                This page will display all products and filters. The path `/shop` is now correctly configured in the Navbar and Router.
            </p>
            <div className="mt-8 p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-red-700">
                    To test the detail page: Manually navigate to <span className="font-mono bg-red-100 p-1 rounded">/product/1</span>
                </p>
            </div>
        </div>
    );
};

export default ShopPage;