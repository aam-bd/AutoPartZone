import React from 'react';

// --- Icons for Services ---
const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600 mx-auto mb-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18L12 10.5V18l-3.75 3.75M8.25 18l3.75-7.5M12 10.5V2.25M12 10.5h4.5M12 2.25h4.5M16.5 2.25V18" />
    </svg>
);
const SupportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600 mx-auto mb-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.513c-.092-.158-.258-.158-.35 0L8.273 7.551a1.125 1.125 0 01-.986.604H5.25c-.621 0-1.125.504-1.125 1.125v3.6c0 .621.504 1.125 1.125 1.125h2.037c.371 0 .717.18.917.472l1.986 2.979c.092.158.258.158.35 0l1.986-2.979c.2-.292.546-.472.917-.472h2.037c.621 0 1.125-.504 1.125-1.125v-3.6c0-.621-.504-1.125-1.125-1.125h-2.037c-.371 0-.717-.18-.917-.472l-1.986-2.979z" />
    </svg>
);
const GuaranteeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600 mx-auto mb-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M12 21a9 9 0 100-18 9 9 0 000 18z" />
    </svg>
);

const ServiceInfoBar = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* 1. Delivery */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <TruckIcon />
                <h3 className="font-extrabold text-lg text-gray-800 mb-1">FREE AND FAST DELIVERY</h3>
                <p className="text-sm text-gray-600">Free delivery for all orders over $140</p>
            </div>
            
            {/* 2. Support */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <SupportIcon />
                <h3 className="font-extrabold text-lg text-gray-800 mb-1">24/7 CUSTOMER SERVICE</h3>
                <p className="text-sm text-gray-600">Friendly 24/7 customer support</p>
            </div>
            
            {/* 3. Guarantee */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <GuaranteeIcon />
                <h3 className="font-extrabold text-lg text-gray-800 mb-1">MONEY BACK GUARANTEE</h3>
                <p className="text-sm text-gray-600">We return money within 30 days</p>
            </div>
            
        </div>
    );
};

export default ServiceInfoBar;