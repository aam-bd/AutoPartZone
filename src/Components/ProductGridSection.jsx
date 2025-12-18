// --- src/Components/ProductGridSection.jsx ---
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 

// Placeholder for the Timer component (used only if showTimer is true)
const FlashSaleTimer = () => {
    // --- Mock Timer Logic ---
    const calculateTimeLeft = () => {
        // Set the target time to be 24 hours from now (mock)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1); // Tomorrow
        targetDate.setHours(23, 59, 59, 0); // End of day

        const difference = +targetDate - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    // Format the time display
    const timerComponents = [];
    Object.keys(timeLeft).forEach(interval => {
        if (!timeLeft[interval] && interval !== 'seconds' && Object.keys(timeLeft).indexOf(interval) < 2) {
            // Don't render until the timer is active, but we only have 3 components, so render 00
            timerComponents.push(
                <span key={interval} className="flex flex-col items-center">
                    <span className="text-xl font-extrabold">{`00`}</span>
                    <span className="text-xs font-medium uppercase">{interval.charAt(0)}</span>
                </span>
            );
        } else {
            timerComponents.push(
                <span key={interval} className="flex flex-col items-center">
                    <span className="text-xl font-extrabold">{String(timeLeft[interval]).padStart(2, '0')}</span>
                    <span className="text-xs font-medium uppercase">{interval.charAt(0)}</span>
                </span>
            );
            if (interval !== "seconds") {
                timerComponents.push(<span key={interval + 'sep'} className="text-red-500 font-bold">:</span>);
            }
        }
    });

    return (
        <div className="flex items-center space-x-2 bg-red-100 text-red-600 p-2 rounded-lg border border-red-300">
            <span className="text-sm font-semibold mr-2">Ends In:</span>
            {timerComponents.length ? timerComponents : <span className="text-sm font-semibold">Time's Up!</span>}
        </div>
    );
};


const ProductGridSection = ({ title, products, showTimer, sectionLink }) => {
    return (
        <section className="product-grid-section">
            
            {/* Header: Title, Timer (optional), and View All Link */}
            <div className="flex justify-between items-center mb-6">
                
                <div className="flex items-center space-x-4">
                    <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-red-600 pb-1">
                        {title}
                    </h2>
                    {showTimer && <FlashSaleTimer />}
                </div>

                {sectionLink && (
                    <Link to={sectionLink} className="text-red-600 font-semibold hover:text-red-800 transition-colors flex items-center">
                        View All
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product, index) => (
                    <ProductCard 
                        key={`product-${product.id}-${index}`} 
                        product={product} 
                        // You can pass specific props here if needed
                    />
                ))}
            </div>
            
        </section>
    );
};

export default ProductGridSection;