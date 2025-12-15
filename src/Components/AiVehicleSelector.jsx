import React, { useState } from 'react';
import { useVehicle } from '../context/VehicleContext';

// --- Icons (Placeholders) ---
const CarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18L12 10.5V18l-3.75 3.75M8.25 18l3.75-7.5M12 10.5V2.25M12 10.5h4.5M12 2.25h4.5M16.5 2.25V18" />
    </svg>
);
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


const AiVehicleSelector = () => {
    // Access the global vehicle state and setter
    const { selectedVehicle, selectVehicle, clearVehicle } = useVehicle();
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    const handleManualSelect = (e) => {
        e.preventDefault();
        if (make && model && year) {
            // NOTE: In a real app, this would hit an API endpoint 
            // to validate the vehicle and get a unique vehicleId (e.g., VIN-based ID)
            const mockVehicleId = `${year}-${make.substring(0, 2)}-${model.substring(0, 2)}`;
            
            selectVehicle({ 
                make, 
                model, 
                year, 
                vehicleId: mockVehicleId 
            });
            // Clear inputs after successful selection
            setMake(''); setModel(''); setYear('');
        }
    };

    const handleAiSearch = () => {
        // TODO: Implement VIN/License Plate/Image search modal logic here
        console.log("Opening AI VIN / Image Search Modal...");
        // This process would eventually call selectVehicle with the result.
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-red-600">
            
            {/* --- Vehicle Display / Status Bar --- */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <CarIcon />
                    <h2 className="text-xl font-bold text-gray-800">
                        {selectedVehicle ? 'Shopping For:' : 'Select Your Vehicle for Guaranteed Fitment'}
                    </h2>
                </div>
                
                {selectedVehicle && (
                    <div className="text-red-600 font-semibold flex items-center">
                        <span className="mr-2 text-lg">
                            {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                        </span>
                        <button 
                            onClick={clearVehicle} 
                            className="text-sm text-gray-500 hover:text-red-600 underline"
                        >
                            (Change)
                        </button>
                    </div>
                )}
            </div>

            <div className={`grid gap-4 ${selectedVehicle ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* --- 1. Manual Make/Model/Year Search --- */}
                <form onSubmit={handleManualSelect} className="flex gap-3 bg-gray-50 p-4 rounded-lg border">
                    <select 
                        className="flex-1 p-3 border rounded-lg focus:ring-red-500"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                    >
                        <option value="">Year</option>
                        {/* Generate years dynamically or fetch popular years */}
                        {['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    
                    <input 
                        type="text" 
                        placeholder="Make (e.g., Toyota)" 
                        className="flex-1 p-3 border rounded-lg focus:ring-red-500"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        required
                    />
                    
                    <input 
                        type="text" 
                        placeholder="Model (e.g., Camry)" 
                        className="flex-1 p-3 border rounded-lg focus:ring-red-500"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        required
                    />
                    
                    <button 
                        type="submit" 
                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center font-semibold"
                    >
                        <SearchIcon /> FIND PARTS
                    </button>
                </form>

                {/* --- 2. AI / VIN / Image Search Option --- */}
                <div className="text-center text-sm text-gray-500 font-medium my-2">
                    — OR —
                </div>

                <div className="flex justify-center">
                    <button 
                        onClick={handleAiSearch} 
                        className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors font-semibold shadow-lg flex items-center"
                    >
                        <span className="text-yellow-400 mr-2 font-bold text-xl">AI</span> 
                        Search by VIN, License Plate or Image
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiVehicleSelector;