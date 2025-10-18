import { useState, useEffect, use } from "react";
import toast from "react-hot-toast";
import { FiHome, FiPlus, FiHeart, FiSettings, FiMapPin, FiEye, FiTrash2 } from "react-icons/fi";
import { GoHistory } from "react-icons/go";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";
import ConfirmBox from "../../components/ConfirmBox";

import { useUser } from "../../utils/userContext";
import { useNavigate } from "react-router-dom";
import { uploadProperty, fetchUserProperties, deleteProperty } from "../../backend/property";
import { updateUserProfile } from "../../backend/user";

const Dashboard = () => {
    const { user, setUser, handleLogout } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("listings");

    useEffect(() => {
        document.title = "Dashboard | Aangan - Property Solutions";
    }, []);

    useEffect(() => {
        if (user === null) {
            navigate("/auth/login");
        }
        // console.log(user);
    }, [user]);

    const tabs = [
        { id: "listings", label: "My Listings", icon: FiHome },
        { id: "add-property", label: "Add Property", icon: FiPlus },
        { id: "history", label: "History", icon: GoHistory },
        { id: "liked", label: "Liked Properties", icon: FiHeart },
        { id: "settings", label: "Settings", icon: FiSettings },
    ];

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "var(--papaya_whip-900)" }}
        >
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1
                                className="text-3xl font-bold"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                Welcome back, {user?.firstName}!
                            </h1>
                            <p style={{ color: "var(--air_superiority_blue-400)" }}>Manage your properties and account</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                                activeTab === tab.id ? "text-white" : "hover:bg-gray-50"
                                            }`}
                                            style={{
                                                backgroundColor: activeTab === tab.id ? "var(--fire_brick-500)" : "transparent",
                                                color: activeTab === tab.id ? "white" : "var(--prussian_blue-500)",
                                            }}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            {activeTab === "listings" && (
                                <ListingsSection
                                    setActiveTab={setActiveTab}
                                    user={user}
                                />
                            )}
                            {activeTab === "add-property" && <AddPropertySection user={user} />}
                            {activeTab === "history" && <HistorySection />}
                            {activeTab === "liked" && <LikedPropertiesSection />}
                            {activeTab === "settings" && <SettingsSection user={user} />}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Listings Section Component
const ListingsSection = ({ setActiveTab, user }) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    useEffect(() => {
        const loadListings = async () => {
            if (!user) return;
            setLoading(true);
            const data = await fetchUserProperties(user.id || user.sub);
            setListings(data);
            setLoading(false);
        };

        loadListings();
    }, []);

    const handleDelete = async (propertyId) => {
        const success = await deleteProperty(propertyId);
        if (success) {
            setListings((prev) => prev.filter((p) => p.id !== propertyId));
        }
        setConfirmOpen(false);
    };

    return (
        <div>
            {/* Confirm Box */}
            <ConfirmBox
                open={confirmOpen}
                title="Delete Property?"
                message="Are you sure you want to delete this property? This action cannot be undone."
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => handleDelete(selectedProperty)}
            />

            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--prussian_blue-500)" }}
                >
                    My Property Listings
                </h2>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: "var(--fire_brick-500)" }}
                    onClick={() => setActiveTab("add-property")}
                >
                    <FiPlus className="w-4 h-4" />
                    Add Property
                </button>
            </div>

            {/* Property Cards */}
            {loading ? (
                <div className="flex flex-col gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-12">
                    <FiHome
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "var(--air_superiority_blue-400)" }}
                    />
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">No properties listed yet</h3>
                    <p className="text-gray-500">Start by adding your first property listing</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => {
                        // Use first image of the property or fallback
                        const coverImage =
                            listing.images && listing.images.length > 0
                                ? listing.images[0]
                                : "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80";

                        return (
                            <div
                                key={listing.id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                            >
                                {/* Image */}
                                <div className="h-48 bg-gray-100">
                                    <img
                                        src={coverImage}
                                        alt={listing.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Details */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">{listing.title}</h3>
                                        <p className="flex items-center text-gray-500 text-sm mt-1">
                                            <FiMapPin className="w-4 h-4 mr-1" /> {listing.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-lg font-semibold text-indigo-600">₹{listing.price}</span>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => (window.location.href = `/property/${listing.id}`)}
                                                className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedProperty(listing.id);
                                                    setConfirmOpen(true);
                                                }}
                                                className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const AddPropertySection = ({ user }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        listingType: "",
        location: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        furnishingStatus: "",
    });
    const [images, setImages] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        let newFiles = [...images, ...selectedFiles];

        // ✅ If more than 4 images selected, take only first 4
        if (newFiles.length > 4) {
            newFiles = newFiles.slice(0, 4);
            toast.error("You can upload a maximum of 4 images per property.");
        }

        setImages(newFiles);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(user);

        try {
            await uploadProperty(formData, user, images);
            toast.success("Property added successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                price: "",
                listingType: "",
                location: "",
                propertyType: "",
                bedrooms: "",
                bathrooms: "",
                area: "",
                furnishingStatus: "",
            });
            setImages([]);
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--prussian_blue-500)" }}
            >
                Add New Property
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Existing form fields... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    {" "}
                    <div className=" col-span-full">
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Property Title{" "}
                        </label>{" "}
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter property title"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Price (₹){" "}
                        </label>{" "}
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter price"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Listing Type{" "}
                        </label>{" "}
                        <select
                            name="listingType"
                            value={formData.listingType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        >
                            {" "}
                            <option value="">Select listing type</option> <option value="sale">Sale</option> <option value="rent">Rent</option>{" "}
                        </select>{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Location{" "}
                        </label>{" "}
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter location"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Property Type{" "}
                        </label>{" "}
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        >
                            {" "}
                            <option value="">Select property type</option> <option value="apartment">Apartment</option>{" "}
                            <option value="house">House</option> <option value="villa">Villa</option> <option value="plot">Plot</option>{" "}
                            <option value="penthouse">Penthouse</option>{" "}
                        </select>{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Bedrooms{" "}
                        </label>{" "}
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Number of bedrooms"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Bathrooms{" "}
                        </label>{" "}
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Number of bathrooms"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Area (sq ft){" "}
                        </label>{" "}
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Property area"
                        />{" "}
                    </div>{" "}
                    <div>
                        {" "}
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            {" "}
                            Furnishing Status{" "}
                        </label>{" "}
                        <select
                            name="furnishingStatus"
                            value={formData.furnishingStatus}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        >
                            {" "}
                            <option value="">Select furnishing status</option> <option value="furnished">Furnished</option>{" "}
                            <option value="semi-furnished">Semi-Furnished</option> <option value="unfurnished">Unfurnished</option>{" "}
                        </select>{" "}
                    </div>{" "}
                </div>{" "}
                <div>
                    {" "}
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        {" "}
                        Description{" "}
                    </label>{" "}
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        placeholder="Describe your property..."
                    />{" "}
                </div>
                {/* 🖼️ Image Upload */}
                <div>
                    <div className="w-full">
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Upload Property Images
                        </label>

                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer 
                   transition-all duration-300 hover:shadow-md hover:border-[var(--prussian_blue-500)] bg-white"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 mb-3 text-[var(--air_superiority_blue-400)]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.9A5 5 0 0115.9 8H17a4 4 0 010 8H7z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>

                            <span className="text-sm font-medium text-[var(--air_superiority_blue-500)]">Click to upload or drag & drop images</span>
                            <span className="text-xs mt-1 text-[var(--air_superiority_blue-400)]">(Max 4 images)</span>

                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Preview */}
                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative"
                                >
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`preview-${index}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full px-2 py-1 text-xs"
                                        onClick={() => removeImage(index)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-lg text-white"
                        style={{ backgroundColor: "var(--fire_brick-500)" }}
                    >
                        {loading ? "Adding..." : "Add Property"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setImages([])}
                        className="px-6 py-3 rounded-lg border"
                        style={{ borderColor: "var(--air_superiority_blue-900)", color: "var(--prussian_blue-500)" }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

// History Section Component
const HistorySection = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user's property history
        setTimeout(() => {
            setHistory([]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div>
            <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--prussian_blue-500)" }}
            >
                Property History
            </h2>

            {loading ? (
                <div className="gap-6 grid grid-cols-3">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-12">
                    <GoHistory
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "var(--air_superiority_blue-400)" }}
                    />
                    <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        No history found
                    </h3>
                    <p style={{ color: "var(--air_superiority_blue-400)" }}>Your property viewing and interaction history will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg p-4"
                        >
                            {/* History item content */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Liked Properties Section Component
const LikedPropertiesSection = () => {
    const [likedProperties, setLikedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user's liked properties
        setTimeout(() => {
            setLikedProperties([]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div>
            <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--prussian_blue-500)" }}
            >
                Liked Properties
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            ) : likedProperties.length === 0 ? (
                <div className="text-center py-12">
                    <FiHeart
                        className="w-16 h-16 mx-auto mb-4"
                        style={{ color: "var(--air_superiority_blue-400)" }}
                    />
                    <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        No liked properties yet
                    </h3>
                    <p style={{ color: "var(--air_superiority_blue-400)" }}>Properties you like will be saved here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedProperties.map((property) => (
                        <div
                            key={property.id}
                            className="border rounded-lg p-4"
                        >
                            {/* Liked property card content */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Settings Section Component
const SettingsSection = ({ user }) => {
    const [settings, setSettings] = useState({
        notifications: true,
        emailUpdates: true,
        smsUpdates: false,
    });

    const handleSettingChange = (key, value) => {
        setSettings({
            ...settings,
            [key]: value,
        });
    };

    return (
        <>
            <ProfileSection user={user} />
            <div className="pt-10">
                <h2
                    className="text-2xl font-bold mb-6"
                    style={{ color: "var(--prussian_blue-500)" }}
                >
                    Account Settings
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3
                            className="text-lg font-semibold mb-4"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between">
                                <span style={{ color: "var(--prussian_blue-500)" }}>Push Notifications</span>
                                <input
                                    type="checkbox"
                                    checked={settings.notifications}
                                    onChange={(e) => handleSettingChange("notifications", e.target.checked)}
                                    className="w-4 h-4"
                                    style={{ accentColor: "var(--fire_brick-500)" }}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: "var(--prussian_blue-500)" }}>Email Updates</span>
                                <input
                                    type="checkbox"
                                    checked={settings.emailUpdates}
                                    onChange={(e) => handleSettingChange("emailUpdates", e.target.checked)}
                                    className="w-4 h-4"
                                    style={{ accentColor: "var(--fire_brick-500)" }}
                                />
                            </label>
                            <label className="flex items-center justify-between">
                                <span style={{ color: "var(--prussian_blue-500)" }}>SMS Updates</span>
                                <input
                                    type="checkbox"
                                    checked={settings.smsUpdates}
                                    onChange={(e) => handleSettingChange("smsUpdates", e.target.checked)}
                                    className="w-4 h-4"
                                    style={{ accentColor: "var(--fire_brick-500)" }}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <h3
                            className="text-lg font-semibold mb-4"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Account Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p
                                className="text-sm"
                                style={{ color: "var(--air_superiority_blue-400)" }}
                            >
                                Member since: {new Date(user?.created_at).toLocaleDateString()}
                            </p>
                            <p
                                className="text-sm"
                                style={{ color: "var(--air_superiority_blue-400)" }}
                            >
                                Role: {user?.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Profile Section Component
const ProfileSection = () => {
    const { user, setUser } = useUser();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    // Sync user data to form
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // If phone input, allow only up to 10 digits
        if (name === "phone") {
            if (value.length > 10) return; // stop updating if more than 10
        }

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const { firstName, lastName, email, phone } = formData;
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
            toast.error("All fields are required!");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email format!");
            return false;
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Phone must be exactly 10 digits!");
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const result = await updateUserProfile(formData);

            if (result.success) {
                // Update context state
                setUser({
                    ...user,
                    ...formData,
                });
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <div className="flex items-center justify-between mb-6">
                <h2
                    className="text-2xl font-bold"
                    style={{ color: "var(--prussian_blue-500)" }}
                >
                    Profile Information
                </h2>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: "var(--fire_brick-500)" }}
                >
                    {isEditing ? "Cancel" : "Edit Profile"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    />
                </div>

                {/* Email */}
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled={true}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200 ${
                            isEditing ? "disabled:cursor-not-allowed" : ""
                        }`}
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Phone
                    </label>
                    <input
                        type="number"
                        name="phone"
                        maxLength={10}
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    />
                </div>
            </div>

            {isEditing && (
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 rounded-lg text-white"
                        style={{ backgroundColor: "var(--fire_brick-500)" }}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-lg border"
                        style={{ borderColor: "var(--air_superiority_blue-900)", color: "var(--prussian_blue-500)" }}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
