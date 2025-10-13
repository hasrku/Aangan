import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PropertyCard from "../components/PropertyCard";
import Footer from "../components/Footer";
import axios from "axios";

const Home = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [activeCategory, setActiveCategory] = useState("all");
    const [loading, setLoading] = useState(true);

    // Generate property data with images from Unsplash
    const generateProperties = async () => {
        const propertyTypes = ["Apartment", "House", "Villa", "Studio", "Penthouse"];
        const locations = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Hyderabad"];
        const categories = ["buy", "sell", "rent"];

        const propertyData = [];

        for (let i = 0; i < 10; i++) {
            const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];

            // Generate random price based on category
            let price;
            if (category === "rent") {
                price = Math.floor(Math.random() * 50000) + 10000; // 10k-60k for rent
            } else {
                price = Math.floor(Math.random() * 50000000) + 5000000; // 50L-5Cr for buy/sell
            }

            const bedrooms = Math.floor(Math.random() * 4) + 1;
            const bathrooms = Math.floor(Math.random() * 3) + 1;
            const area = Math.floor(Math.random() * 2000) + 500;

            // Generate image URL with property-related queries
            const imageQueries = [
                "modern house exterior",
                "apartment building",
                "luxury villa",
                "studio apartment",
                "penthouse view",
                "townhouse",
                "real estate property",
                "residential building",
            ];

            const query = imageQueries[Math.floor(Math.random() * imageQueries.length)];
            const imageUrl = `https://images.unsplash.com/photo-${Math.floor(
                Math.random() * 1000000
            )}?w=400&h=300&fit=crop&crop=center&auto=format&q=80&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
            propertyData.push({
                id: i + 1,
                title: `${type} in ${location}`,
                price,
                location,
                bedrooms,
                bathrooms,
                area,
                image: imageUrl,
                type: category,
                category,
            });
        }

        setProperties(propertyData);
        setFilteredProperties(propertyData.filter((p) => p.category === activeCategory));
        setLoading(false);
    };

    useEffect(() => {
        document.title = "Aangan - Property Solutions";
    }, []);

    useEffect(() => {
        generateProperties();
    }, []);

    useEffect(() => {
        if (activeCategory === "all") {
            setFilteredProperties(properties);
        } else {
            setFilteredProperties(properties.filter((p) => p.category === activeCategory));
        }
    }, [activeCategory, properties]);

    const handleFilterChange = (filters) => {
        let filtered = activeCategory === "all" ? properties : properties.filter((p) => p.category === activeCategory);

        if (filters.priceRange.min) {
            filtered = filtered.filter((p) => p.price >= parseInt(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter((p) => p.price <= parseInt(filters.priceRange.max));
        }
        if (filters.propertyType) {
            filtered = filtered.filter((p) => p.title.toLowerCase().includes(filters.propertyType.toLowerCase()));
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
                <Sidebar
                    onFilterChange={handleFilterChange}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />

                <main className="flex-1 p-6 px-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Category Tabs */}
                        <div
                            className="flex space-x-1 mb-6 p-1 rounded-lg w-fit"
                            style={{ backgroundColor: "var(--papaya_whip-800)" }}
                        >
                            {["all", "buy", "sell", "rent"].map((category) => (
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
                        </div>

                        {/* Results Count */}
                        <div className="mb-6">
                            <h2
                                className="text-2xl font-bold mb-1"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                {filteredProperties.length} Properties Found
                            </h2>
                            <p style={{ color: "var(--air_superiority_blue-400)" }}>Showing properties for {activeCategory}</p>
                        </div>

                        {/* Properties Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl shadow-sm border overflow-hidden animate-pulse"
                                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                                    >
                                        <div
                                            className="h-48"
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
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProperties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && filteredProperties.length === 0 && (
                            <div className="text-center py-12">
                                <div
                                    className="mb-4"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                >
                                    <svg
                                        className="w-16 h-16 mx-auto"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                </div>
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
