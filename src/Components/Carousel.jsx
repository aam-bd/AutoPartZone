import React, { useState, useEffect } from 'react';
// Import Link for connecting caption buttons/links to routes
import { Link } from 'react-router-dom';

const Carousel = ({ images, autoSlide = true, slideInterval = 5000 }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Function to move to the next slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Function to move to the previous slide
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    // Automatic slide logic
    useEffect(() => {
        if (!autoSlide) return;

        const intervalId = setInterval(() => {
            nextSlide();
        }, slideInterval);

        return () => clearInterval(intervalId);
    }, [autoSlide, slideInterval]);

    // Ensure the entire carousel height fits the image/container
    return (
        <div className="relative overflow-hidden rounded-lg shadow-xl h-96 w-full">
            
            {/* 1. Slides Container */}
            <div 
                className="flex transition-transform ease-out duration-700 h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {images.map((image, index) => (
                    <div key={index} className="w-full flex-shrink-0 relative">
                        {/* Image */}
                        <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-full object-cover" 
                        />
                        
                        {/* Caption Overlay */}
                        {image.caption && (
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-start p-16 text-white">
                                <div className="max-w-xl">
                                    <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
                                        {image.caption.title}
                                    </h1>
                                    <p className="text-lg lg:text-xl font-medium mb-6">
                                        {image.caption.description}
                                    </p>
                                    {/* Example Call to Action Button */}
                                    <Link to="/shop" className="bg-red-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-red-700 transition-colors duration-300">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 2. Controls (Arrows) */}
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button 
                    onClick={prevSlide}
                    className="p-2 rounded-full shadow bg-white/60 text-gray-800 hover:bg-white transition-colors"
                >
                    &lt;
                </button>
                <button 
                    onClick={nextSlide}
                    className="p-2 rounded-full shadow bg-white/60 text-gray-800 hover:bg-white transition-colors"
                >
                    &gt;
                </button>
            </div>

            {/* 3. Indicators (Dots) */}
            <div className="absolute bottom-4 left-0 right-0">
                <div className="flex items-center justify-center gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`transition-all w-3 h-3 bg-white rounded-full ${currentSlide === i ? 'p-2 opacity-100' : 'bg-opacity-50'}`}
                        />
                    ))}
                </div>
            </div>
            
        </div>
    );
};

export default Carousel;