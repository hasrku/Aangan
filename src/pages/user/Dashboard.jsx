import React, { useState, useEffect, use } from "react";
import { FiUser, FiHome, FiPlus, FiHeart, FiSettings, FiLogOut } from "react-icons/fi";
import { GoHistory } from "react-icons/go";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SkeletonCard from "../../components/SkeletonCard";

import { useUser } from "../../utils/userContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user, setUser, handleLogout } = useUser();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("profile");

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
        { id: "profile", label: "Profile", icon: FiUser },
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
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
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
                        {/* <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "var(--fire_brick-500)" }}
                        >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                        </button> */}
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
                            {activeTab === "profile" && <ProfileSection user={user} />}
                            {activeTab === "listings" && <ListingsSection />}
                            {activeTab === "add-property" && <AddPropertySection />}
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

// Profile Section Component
const ProfileSection = () => {
    const { user, setUser, handleLogout } = useUser();

    const [isEditing, setIsEditing] = useState(false); // Initialize with empty strings
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    // ✨ ADD THIS useEffect TO SYNC STATE WITH PROPS
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
            });
            console.log(user);
        }
    }, [user]); // This effect runs whenever the 'user' prop changes

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        // TODO: Implement profile update
        console.log("Saving profile:", formData);
        setIsEditing(false);
    };

    return (
        <div>
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
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
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
                        className="px-6 py-2 rounded-lg text-white"
                        style={{ backgroundColor: "var(--fire_brick-500)" }}
                    >
                        Save Changes
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

// Listings Section Component
const ListingsSection = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user's property listings
        // setTimeout(() => {
        //     setListings([]);
        //     setLoading(false);
        // }, 1000);
    }, []);

    return (
        <div>
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
                >
                    <FiPlus className="w-4 h-4" />
                    Add Property
                </button>
            </div>

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
                    <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        No properties listed yet
                    </h3>
                    <p style={{ color: "var(--air_superiority_blue-400)" }}>Start by adding your first property listing</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="border rounded-lg p-4"
                        >
                            {/* Property card content */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Add Property Section Component
const AddPropertySection = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        images: [],
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement property creation
        console.log("Adding property:", formData);
        setTimeout(() => setLoading(false), 2000);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Property Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter property title"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Price (₹)
                        </label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter price"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Enter location"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Property Type
                        </label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        >
                            <option value="">Select property type</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                            <option value="plot">Plot</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Bedrooms
                        </label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Number of bedrooms"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Bathrooms
                        </label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Number of bathrooms"
                        />
                    </div>
                    <div>
                        <label
                            className="block text-sm font-medium mb-2"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Area (sq ft)
                        </label>
                        <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                            style={{ borderColor: "var(--air_superiority_blue-900)" }}
                            placeholder="Property area"
                        />
                    </div>
                </div>

                <div>
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "var(--prussian_blue-500)" }}
                    >
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                        style={{ borderColor: "var(--air_superiority_blue-900)" }}
                        placeholder="Describe your property..."
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-3 rounded-lg text-white"
                        style={{ backgroundColor: "var(--fire_brick-500)" }}
                    >
                        Add Property
                    </button>
                    <button
                        type="button"
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
        <div>
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
    );
};

export default Dashboard;
