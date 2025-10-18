import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FiMapPin, FiHeart, FiPhone, FiUser } from "react-icons/fi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { motion } from "framer-motion";
import { fetchPropertyById } from "../backend/property";
import toast from "react-hot-toast";

import house1 from "../assets/house1.jpeg";
import house2 from "../assets/house2.jpeg";
import house3 from "../assets/house3.jpeg";

const PropertyDetails = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const loadProperty = async () => {
            setLoading(true);
            const data = await fetchPropertyById(id);
            if (!data) {
                toast.error("Property not found!");
            } else {
                setProperty(data);
            }
            setLoading(false);
        };
        loadProperty();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">Loading property details...</div>;
    }

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
                <p className="text-xl font-semibold mb-2">Property not found</p>
                <p>It may have been deleted or doesn’t exist.</p>
            </div>
        );
    }

    // const images = [house1, house2, house3];
    const images = property.images && property.images.length > 0 ? property.images : [house1, house2, house3];

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "var(--papaya_whip-900)" }}
        >
            <Header />

            <main className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 p-8 mt-6">
                {/* Left: Carousel */}
                <div className="md:w-[600px] w-full relative">
                    <motion.div
                        key={currentImage}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-2xl  overflow-hidden shadow-md relative"
                    >
                        <img
                            src={images[currentImage]}
                            alt={`Property view ${currentImage + 1}`}
                            className="object-cover w-full h-[480px]"
                        />

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-3 h-12 aspect-square flex justify-center items-center text-center text-2xl shadow-md transition"
                                >
                                    <GrFormPrevious />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-3 h-12 aspect-square flex justify-center items-center text-center text-2xl shadow-md transition"
                                >
                                    <GrFormNext />
                                </button>
                            </>
                        )}
                    </motion.div>

                    <p className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md shadow-md">{property.listing_type}</p>

                    {/* Thumbnail Row */}
                    {images.length > 1 && (
                        <div className="flex gap-3 mt-4 justify-center">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    onClick={() => setCurrentImage(i)}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border transition ${
                                        i === currentImage ? "border-[var(--prussian_blue-500)]" : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                    alt={`Thumbnail ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="lg:w-1/2 w-full space-y-8">
                    <div
                        className="bg-white p-8 rounded-2xl shadow-sm border"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h1
                                className="text-3xl font-bold mb-2"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                {property.title}
                            </h1>
                            <button
                                className="flex items-center justify-center p-2 rounded-lg border transition hover:bg-[var(--papaya_whip-800)]"
                                style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            >
                                <FiHeart
                                    className="text-xl"
                                    style={{ color: "var(--prussian_blue-500)" }}
                                />
                            </button>
                        </div>

                        <div
                            className="flex items-center text-sm"
                            style={{ color: "var(--air_superiority_blue-500)" }}
                        >
                            <FiMapPin className="mr-2" />
                            <span>{property.location}</span>

                            <div className="flex ml-auto items-center gap-3 opacity-80">
                                <div className="p-1 rounded-full bg-amber-50">
                                    <FiUser
                                        className="text-xl"
                                        style={{ color: "var(--prussian_blue-300)" }}
                                    />
                                </div>
                                <h3
                                    className="text-md font-semibold"
                                    style={{ color: "var(--prussian_blue-500)" }}
                                >
                                    {property.owner?.firstName ? `${property.owner.firstName} ${property.owner.lastName}` : "Owner"}
                                </h3>
                            </div>
                        </div>

                        <div className="flex mb-4">
                            <p className="text-lg font-semibold text-gray-800">₹{property.price}</p>
                            <p
                                className="text-sm ml-auto"
                                style={{ color: "var(--air_superiority_blue-500)" }}
                            >
                                {property.owner?.phone || "N/A"}
                            </p>
                        </div>

                        <p
                            className="text-base leading-relaxed mb-6"
                            style={{ color: "var(--air_superiority_blue-400)" }}
                        >
                            {property.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Bedrooms</p>
                                <p className="font-medium text-gray-800">{property.bedrooms}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Bathrooms</p>
                                <p className="font-medium text-gray-800">{property.bathrooms}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Area</p>
                                <p className="font-medium text-gray-800">{property.area} sq.ft</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Furnishing</p>
                                <p className="font-medium text-gray-800">{property.furnishing_status}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                            <button
                                className="flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition"
                                style={{
                                    backgroundColor: "var(--prussian_blue-500)",
                                    color: "white",
                                }}
                                onClick={() => window.open(`tel:${property.owner?.phone}`, "_self")}
                            >
                                <FiPhone /> Contact Owner
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PropertyDetails;
