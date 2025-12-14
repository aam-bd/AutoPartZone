import React from 'react';
import { NavLink } from 'react-router-dom';

// --- Icons (Placeholders for visual appeal) ---
// Note the explicit semicolon at the end of each line now.
const EngineIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3H7.5M3.75 3h10.5M6 16.5h2.25m-2.25 0a2.25 2.25 0 002.25 2.25h.75m-4.5 0h4.5M6 16.5a2.25 2.25 0 002.25-2.25V11.25m-4.5 0h4.5M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25m-2.25 0h4.5M6 16.5a2.25 2.25 0 002.25 2.25h.75m-4.5 0h4.5M6 16.5v2.25m-2.25 0h4.5m-2.25 0a2.25 2.25 0 002.25-2.25V11.25m-4.5 0h4.5M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25m-2.25 0h4.5M6 16.5a2.25 2.25 0 002.25 2.25h.75m-4.5 0h4.5M6 16.5v2.25m-2.25 0h4.5" /></svg>;
const BrakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a8.25 8.25 0 11-16.499 0A8.25 8.25 0 0121 11.25z" /></svg>;
const SuspendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.513c-.092-.158-.258-.158-.35 0L8.273 7.551a1.125 1.125 0 01-.986.604H5.25c-.621 0-1.125.504-1.125 1.125v3.6c0 .621.504 1.125 1.125 1.125h2.037c.371 0 .717.18.917.472l1.986 2.979c.092.158.258.158.35 0l1.986-2.979c.2-.292.546-.472.917-.472h2.037c.621 0 1.125-.504 1.125-1.125v-3.6c0-.621-.504-1.125-1.125-1.125h-2.037c-.371 0-.717-.18-.917-.472l-1.986-2.979z" /></svg>;
const FiltersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM21 8.25h-2.25v2.25H21V8.25zM15 12h-2.25v2.25H15V12zM3 15.75H5.25v2.25H3V15.75zM10.5 18a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM21 18h-2.25v2.25H21V18zM15 15.75H5.25v2.25H15V15.75zM3 8.25H5.25v2.25H3V8.25z" /></svg>;
const AccessoriesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5l3 4.5l3-4.5h-6zM3 17.25h18" /></svg>;

const categories = [
    { name: "Engine & Powertrain", path: "/category/engine", icon: EngineIcon },
    { name: "Suspension & Steering", path: "/category/suspension", icon: SuspendIcon },
    { name: "Brakes & Traction", path: "/category/brakes", icon: BrakeIcon },
    { name: "Filters & Fluids", path: "/category/filters", icon: FiltersIcon },
    { name: "Tools & Equipment", path: "/category/tools", icon: AccessoriesIcon },
    { name: "Lighting & Electrical", path: "/category/lighting", icon: FiltersIcon }, 
    { name: "Interior & Accessories", path: "/category/interior", icon: AccessoriesIcon },
    // Add more categories as needed...
];

const CategorySidebar = () => {
// ... rest of the component is the same
    return (
        <nav className="p-4 bg-gray-50 rounded-lg h-full shadow-md">
            <h3 className="font-extrabold text-lg mb-4 text-red-600 uppercase tracking-wider border-b pb-2">
                Browse Categories
            </h3>
            <ul>
                {categories.map((cat) => (
                    <li key={cat.name} className="my-1">
                        <NavLink 
                            to={cat.path} 
                            className={({ isActive }) => 
                                `flex items-center p-2 rounded-lg transition-colors duration-200 
                                 ${isActive 
                                    ? 'bg-red-100 text-red-700 font-semibold' 
                                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`
                            }
                        >
                            <cat.icon />
                            <span className="text-sm">{cat.name}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default CategorySidebar;