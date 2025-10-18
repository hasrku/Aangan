import React, { useState, useEffect, useRef } from "react";
import {
    FiSearch,
    FiUser,
    FiHeart,
    FiShoppingCart,
    FiBell,
    FiHome,
    FiLogIn,
    FiUserPlus,
    FiSettings,
    FiLogOut,
    FiHelpCircle,
    FiInfo,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

import { useUser } from "../utils/userContext";

const Header = () => {
    const navigate = useNavigate();
    const { user, setUser, handleLogout } = useUser();
    const [searchQuery, setSearchQuery] = useState("");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white shadow-sm border-b border-soft sticky top-0 z-50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center cursor-pointer"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-red-500 to-red-600 p-[6px] rounded-xl shadow-lg">
                                <FiHome className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1
                                    className="text-2xl font-bold"
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
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-8">
                        <form
                            onSubmit={handleSearch}
                            className="relative"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search properties, locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{
                                        borderColor: "var(--air_superiority_blue-900)",
                                        boxShadow: "none",
                                    }}
                                />
                                <FiSearch
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                />
                            </div>
                        </form>
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
