import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import { fetchAllProperties } from "../backend/property";

import { FiFilter } from "react-icons/fi";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Aangan - Property Solutions";
    }, []);

    useEffect(() => {
        if (properties.length === 0) {
            const getProperties = async () => {
                setLoading(true);
                const data = await fetchAllProperties();
                // console.log(data);
                setProperties(data);
                setFilteredProperties(activeCategory === "all" ? data : data.filter((p) => p.listing_type === activeCategory));
                setLoading(false);
            };
            getProperties();
        } else {
            setFilteredProperties(activeCategory === "all" ? properties : properties.filter((p) => p.listing_type === activeCategory));
        }
    }, [activeCategory]);

    const handleFilterChange = (filters) => {
        let filtered = activeCategory === "all" ? properties : properties.filter((p) => p.listing_type === activeCategory);

        if (filters.priceRange?.min) {
            filtered = filtered.filter((p) => Number(p.price) >= Number(filters.priceRange.min));
        }
        if (filters.priceRange?.max) {
            filtered = filtered.filter((p) => Number(p.price) <= Number(filters.priceRange.max));
        }
        if (filters.propertyType) {
            filtered = filtered.filter((p) => p.property_type.toLowerCase() === filters.propertyType.toLowerCase());
        }
        if (filters.location) {
            filtered = filtered.filter((p) => p.location === filters.location);
        }

        setFilteredProperties(filtered);
    };

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "var(--papaya_whip-900)" }}
        >
            <Header />

            <div className="flex">
                <Sidebar onFilterChange={handleFilterChange} />

                <main className="flex-1 p-6 px-3 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Tabs */}
                        <div
                            className="flex space-x-1 mb-6 p-1 rounded-lg w-fit"
                            style={{ backgroundColor: "var(--papaya_whip-800)" }}
                        >
                            {["all", "sale", "rent"].map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-2 mr-2 rounded-md font-medium transition-colors duration-200 capitalize ${
                                        activeCategory === category ? "shadow-sm border" : ""
                                    }`}
                                    style={
                                        activeCategory === category
                                            ? {
                                                  color: "var(--prussian_blue-500)",
                                                  backgroundColor: "#fff",
                                                  borderColor: "var(--air_superiority_blue-900)",
                                              }
                                            : { color: "var(--air_superiority_blue-300)" }
                                    }
                                >
                                    {category === "all" ? "All" : category}
                                </button>
                            ))}
                            {/* <FiFilter className="size-5" /> */}
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <h2
                                className="text-2xl font-bold mb-1"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                {filteredProperties.length} Properties Found
                            </h2>
                            <p className="text-sm text-gray-500">Showing properties for {activeCategory}</p>
                        </div>

                        {/* Properties Grid */}
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
                                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                                    >
                                        <div
                                            className="h-30 md:h-48"
                                            style={{ backgroundColor: "var(--air_superiority_blue-900)" }}
                                        ></div>
                                        <div className="p-4">
                                            <div
                                                className="h-4 rounded mb-2"
                                                style={{ backgroundColor: "var(--air_superiority_blue-900)" }}
                                            ></div>
                                            <div
                                                className="h-4 rounded w-3/4 mb-4"
                                                style={{ backgroundColor: "var(--air_superiority_blue-900)" }}
                                            ></div>
                                            <div
                                                className="h-8 rounded"
                                                style={{ backgroundColor: "var(--air_superiority_blue-900)" }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredProperties.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
                                {filteredProperties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <h3
                                    className="text-lg font-medium mb-2"
                                    style={{ color: "var(--prussian_blue-500)" }}
                                >
                                    No properties found
                                </h3>
                                <p style={{ color: "var(--air_superiority_blue-400)" }}>Try adjusting your filters to see more results.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
