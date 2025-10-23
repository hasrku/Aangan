import React from "react";
import { FiHeart, FiMapPin, FiMaximize } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa6";

const PropertyCard = ({ property }) => {
    const { id, title, price, location, bedrooms, bathrooms, area, images, listing_type, isFavorite = false } = property;

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
        return `₹${price.toLocaleString()}`;
    };

    const listing_typeToBadgeClass = (t) => {
        if (t === "commercial") return "badge-buy";
        if (t === "sale") return "badge-sell";
        if (t === "rent") return "badge-rent";
        return "";
    };

    // Use first image as cover or fallback
    const coverImage =
        images && images.length > 0
            ? images[0]
            : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center&auto=format&q=80";

    return (
        <div
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 group hover-lift"
            style={{ borderColor: "var(--air_superiority_blue-900)" }}
        >
            {/* Image Container */}
            <div className="relative h-30 md:h-48 overflow-hidden">
                <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors duration-200">
                        <FiHeart className={`w-4 h-4 ${isFavorite ? "text-red-500 fill-current" : "text-gray-600"}`} />
                    </button>
                </div>
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${listing_typeToBadgeClass(listing_type)}`}>
                        {listing_type}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3
                        className="text-lg font-semibold truncate transition-colors duration-200"
                        title={title}
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        {title}
                    </h3>
                    <span
                        className="text-xl font-bold ml-2 hidden md:inline-block"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        {formatPrice(price)}
                    </span>
                </div>

                <div
                    className="flex items-center mb-3"
                    style={{ color: "var(--air_superiority_blue-300)" }}
                >
                    <FiMapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{location}</span>
                    <span className="text-xl font-bold ml-auto inline-block  md:hidden">{formatPrice(price)}</span>
                </div>

                <div
                    className="flex items-center justify-between text-sm mb-4"
                    style={{ color: "var(--air_superiority_blue-300)" }}
                >
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <FaBed className="w-4 h-4 mr-1" />
                            <span>{bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                            <FaBath className="w-4 h-4 mr-1" />
                            <span>{bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                            <FiMaximize className="w-4 h-4 mr-1" />
                            <span>{area} sq ft</span>
                        </div>
                    </div>
                </div>

                <button
                    className="w-full py-2 px-4 rounded-lg transition-colors duration-200 font-medium border"
                    style={{
                        color: "var(--prussian_blue-500)",
                        backgroundColor: "var(--papaya_whip-900)",
                        borderColor: "var(--air_superiority_blue-900)",
                    }}
                    onClick={() => (window.location.href = `/property/${id}`)}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
