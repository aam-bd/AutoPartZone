import React, { createContext, useContext, useState } from 'react';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const selectVehicle = (vehicleData) => setSelectedVehicle(vehicleData);
    const clearVehicle = () => setSelectedVehicle(null);

    return (
        <VehicleContext.Provider value={{ selectedVehicle, selectVehicle, clearVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => useContext(VehicleContext);