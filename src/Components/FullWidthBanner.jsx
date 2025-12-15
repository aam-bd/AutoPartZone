import React from 'react';
const FullWidthBanner = ({ image, alt, className = 'h-64', title, subtitle }) => (
    <div className={`relative w-full overflow-hidden rounded-lg ${className}`}>
        <img src={image} alt={alt} className="w-full h-full object-cover" />
        {title && (
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-4">
                <h2 className="text-4xl font-extrabold">{title}</h2>
                <p className="text-lg mt-2">{subtitle}</p>
            </div>
        )}
    </div>
);
export default FullWidthBanner;