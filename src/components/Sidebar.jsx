import React, { useState } from "react";
import { FiFilter, FiHome, FiDollarSign, FiMapPin, FiChevronDown } from "react-icons/fi";

const Sidebar = ({ onFilterChange }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [propertyType, setPropertyType] = useState("");
    const [location, setLocation] = useState("");

    const propertyTypes = ["Apartment", "House", "Villa", "Plot", "Penthouse"];

    const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"];

    const handleFilterSubmit = () => {
        onFilterChange({
            priceRange,
            propertyType,
            location,
        });
    };

    return (
        <aside
            className="w-80 bg-white border-r h-full overflow-y-auto sidebar-scroll hidden md:block"
            style={{ borderColor: "var(--air_superiority_blue-900)" }}
        >
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <FiFilter
                        className="w-5 h-5 mr-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    />
                    <h2
                        className="text-lg font-semibold"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Filters
                    </h2>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                    <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "var(--air_superiority_blue-300)" }}
                    >
                        Price Range
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                className="block text-xs mb-1"
                                style={{ color: "var(--air_superiority_blue-400)" }}
                            >
                                Min Price
                            </label>
                            <input
                                type="number"
                                placeholder="₹0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-sm"
                                style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-xs mb-1"
                                style={{ color: "var(--air_superiority_blue-400)" }}
                            >
                                Max Price
                            </label>
                            <input
                                type="number"
                                placeholder="₹1Cr+"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-sm"
                                style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Property Type */}
                <div className="mb-8">
                    <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "var(--air_superiority_blue-300)" }}
                    >
                        Property Type
                    </h3>
                    <div className="space-y-2">
                        {propertyTypes.map((type) => (
                            <label
                                key={type}
                                className="flex items-center"
                            >
                                <input
                                    type="radio"
                                    name="propertyType"
                                    value={type}
                                    checked={propertyType === type}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                    className="mr-3"
                                    style={{ accentColor: "var(--prussian_blue-500)" }}
                                />
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                >
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="mb-8">
                    <h3
                        className="text-sm font-medium mb-4"
                        style={{ color: "var(--air_superiority_blue-300)" }}
                    >
                        Location
                    </h3>
                    <div className="space-y-2">
                        {locations.map((loc) => (
                            <label
                                key={loc}
                                className="flex items-center"
                            >
                                <input
                                    type="radio"
                                    name="location"
                                    value={loc}
                                    checked={location === loc}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="mr-3"
                                    style={{ accentColor: "var(--prussian_blue-500)" }}
                                />
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                >
                                    {loc}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply Filters Button */}
                <button
                    onClick={handleFilterSubmit}
                    className="w-full py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl btn-primary"
                >
                    Apply Filters
                </button>

                {/* Clear Filters */}
                <button
                    onClick={() => {
                        setPriceRange({ min: 0, max: 0 });
                        setPropertyType("");
                        setLocation("");
                        onFilterChange({ priceRange: { min: 0, max: 0 }, propertyType: "", location: "" });
                    }}
                    className="w-full mt-3 text-sm py-2 px-4 rounded-lg border transition-all duration-200 font-medium"
                    style={{ color: "var(--prussian_blue-500)", borderColor: "var(--air_superiority_blue-900)" }}
                >
                    Clear All
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
