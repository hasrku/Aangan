import React, { useState, useEffect, useRef, use } from "react";
import { FiSearch, FiUser, FiHome, FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../utils/userContext";
import { supabase } from "../utils/supabaseClient";

const Header = () => {
    const navigate = useNavigate();
    const { user, handleLogout } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const queryInputRef = useRef(null);
    const device_width = window.innerWidth;

    // 🔍 Handle Search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim() || searchQuery.trim().length < 2) return;

        setIsLoading(true);
        setSearchResults([]);
        setIsDropdownOpen(true);

        const { data, error } = await supabase
            .from("properties")
            .select("*")
            .or(
                `listing_type.ilike.%${searchQuery}%,property_type.ilike.%${searchQuery}%,title.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
            );

        if (error) {
            console.error("Search error:", error);
        } else {
            if (data && data.length > 0) {
                setSearchResults(data);
                setIsDropdownOpen(true);
            } else {
                setSearchResults([]);
                setIsDropdownOpen(true);
            }
        }

        setIsLoading(false);
    };

    // 🧩 Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🧩 Close dropdown when clicking outside search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFocus = () => setIsSearchActive(true);
    const handleBlur = () => {
        if (searchQuery.trim() === "") setIsSearchActive(false);
    };

    const showLogoText = !isSearchActive && searchQuery.trim() === "";

    return (
        <header className="bg-white shadow-sm border-b border-soft sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 md:px-0">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-red-500 to-red-600 p-[6px] rounded-xl shadow-lg">
                                <FiHome className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
                            </div>
                            {device_width < 640 && showLogoText && (
                                <div>
                                    <h1
                                        className="text-lg md:text-2xl font-bold sm:bg-amber-50 md:bg-amber-50"
                                        style={{ color: "var(--prussian_blue-500)" }}
                                    >
                                        Aangan
                                    </h1>
                                    <p
                                        className="text-xs"
                                        style={{ color: "var(--air_superiority_blue-700)" }}
                                    >
                                        Property Solutions
                                    </p>
                                </div>
                            )}
                            {device_width >= 640 && (
                                <div>
                                    <h1
                                        className="text-lg md:text-2xl font-bold sm:bg-amber-50 md:bg-amber-50"
                                        style={{ color: "var(--prussian_blue-500)" }}
                                    >
                                        Aangan
                                    </h1>
                                    <p
                                        className="text-xs"
                                        style={{ color: "var(--air_superiority_blue-700)" }}
                                    >
                                        Property Solutions
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div
                        className="flex-1 max-w-lg ml-2 lg:mx-8 relative"
                        ref={searchRef}
                    >
                        <form
                            onSubmit={handleSearch}
                            className="relative"
                        >
                            <input
                                type="text"
                                ref={queryInputRef}
                                placeholder="Search properties, locations..."
                                value={searchQuery}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                style={{
                                    borderColor: "var(--air_superiority_blue-900)",
                                    boxShadow: "none",
                                }}
                            />
                            <FiSearch
                                onClick={handleSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                style={{ color: "var(--air_superiority_blue-400)" }}
                            />
                        </form>

                        {/* Search Results Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                                {isLoading ? (
                                    <div className="text-center p-3 text-gray-500">Loading...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.map((property) => (
                                        <div
                                            key={property.id}
                                            onClick={() => {
                                                navigate(`/property/${property.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <p className="font-medium text-gray-800">{property.title}</p>
                                            <p className="text-sm text-gray-500">{property.location}</p>
                                        </div>
                                    ))
                                ) : (
                                    searchQuery && <div className="text-center p-3 text-gray-500">No results found</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        <div
                            className="relative"
                            ref={dropdownRef}
                        >
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                <FiUser className="w-5 h-5" />
                                <span className="hidden sm:block">{user ? user.firstName : "Account"}</span>
                            </button>

                            {/* Dropdown (same as before) */}
                            {/* User Dropdown Modal */}
                            {isUserDropdownOpen && (
                                <div className="absolute right-16 top-7 mt-2 w-48  rounded-lg shadow-lg  py-2 z-50">
                                    {user && user.email ? (
                                        <>
                                            <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4">
                                                {/* Profile Info */}
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold mb-2">
                                                        {user?.firstName?.[0] || "U"}
                                                    </div>
                                                    <p className="font-semibold text-gray-800">
                                                        {user?.firstName} {user?.lastName}
                                                    </p>
                                                    <p className="text-gray-500 text-sm truncate">{user?.email}</p>
                                                </div>

                                                <hr className="border-gray-200" />

                                                {/* Actions */}
                                                <div className="flex flex-col space-y-1">
                                                    <Link
                                                        to="/user/dashboard"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <FiUser className="w-5 h-5 mr-3 text-red-500" />
                                                        Profile
                                                    </Link>

                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                    >
                                                        <FiLogOut className="w-5 h-5 mr-3 text-red-500" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-64 bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4">
                                                {/* Guest Info */}
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-2xl font-bold mb-2">
                                                        ?
                                                    </div>
                                                    <p className="font-semibold text-gray-800">Welcome!</p>
                                                    <p className="text-gray-500 text-sm">Please log in or sign up to continue</p>
                                                </div>

                                                <hr className="border-gray-200" />

                                                {/* Actions */}
                                                <div className="flex flex-col space-y-1">
                                                    <Link
                                                        to="/auth/login"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <FiLogIn className="w-5 h-5 mr-3 text-red-500" />
                                                        Login
                                                    </Link>

                                                    <Link
                                                        to="/auth/signup"
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <FiUserPlus className="w-5 h-5 mr-3 text-red-500" />
                                                        Sign Up
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
