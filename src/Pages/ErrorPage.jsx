import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        
        {/* Animated Icon / Illustration */}
        <div className="mb-8">
            <svg 
              className="mx-auto h-32 w-32 text-indigo-500 opacity-20" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
        </div>

        {/* Main 404 Text */}
        <div>
          <h1 className="text-9xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <p className="mt-2 text-2xl font-semibold text-gray-600">
            Page not found
          </p>
          <p className="mt-4 text-gray-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg transition duration-150 ease-in-out shadow-sm hover:shadow-lg"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;