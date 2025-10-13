import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { useUser } from "../../utils/userContext";
import { signUpUser } from "../../backend/auth";

const Signup = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        document.title = "Sign Up | Aangan - Property Solutions";
    }, []);

    useEffect(() => {
        // ✅ Only redirect if user exists and is authenticated
        if (user && user.email) {
            navigate("/user/dashboard");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // If phone input, allow only up to 10 digits
        if (name === "phone") {
            if (value.length > 10) return; // stop updating if more than 10
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
            setError("All fields are required");
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        // Phone validation (10 digits for India)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError("Please enter a valid 10-digit phone number");
            setIsLoading(false);
            return;
        }

        // Password validation (minimum 6 characters)
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const data = await signUpUser(formData);
            setUser(data.user.user_metadata);
            setSuccess("Account created successfully!.");

            setTimeout(() => {
                navigate("/user/dashboard");
            }, 2000);
        } catch (error) {
            console.error("Signup error:", error);
            setError("Signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center my-5"
            style={{ backgroundColor: "var(--papaya_whip-900)" }}
        >
            <div className="max-w-md w-full mx-4">
                <div
                    className="bg-white rounded-xl shadow-lg p-8"
                    style={{ borderColor: "var(--air_superiority_blue-900)" }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div
                                className="p-3 rounded-xl shadow-lg"
                                style={{
                                    background: "linear-gradient(135deg, var(--fire_brick-500), var(--barn_red-500))",
                                }}
                            >
                                <FiUser className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Create Account
                        </h1>
                        <p
                            style={{
                                color: "var(--air_superiority_blue-400)",
                            }}
                        >
                            Sign up to get started
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && <div className="mb-4 p-3 text-center text-sm rounded-lg bg-red-50 text-red-600 font-medium">{error}</div>}

                    {/* Success Message */}
                    {success && <div className="mb-4 p-3 text-center text-sm rounded-lg bg-green-50 text-green-600 font-medium">{success}</div>}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: "var(--prussian_blue-500)",
                                    }}
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{
                                        borderColor: "var(--air_superiority_blue-900)",
                                    }}
                                    placeholder="First name"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{
                                        color: "var(--prussian_blue-500)",
                                    }}
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{
                                        borderColor: "var(--air_superiority_blue-900)",
                                    }}
                                    placeholder="Last name"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color: "var(--prussian_blue-500)",
                                }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    style={{
                                        color: "var(--air_superiority_blue-400)",
                                    }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{
                                        borderColor: "var(--air_superiority_blue-900)",
                                    }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color: "var(--prussian_blue-500)",
                                }}
                            >
                                Phone Number
                            </label>
                            <div
                                style={{
                                    borderColor: "var(--air_superiority_blue-900)",
                                }}
                                className="flex border rounded-lg"
                            >
                                <span className="px-3 flex justify-center items-center rounded-l-lg  text-gray-700 font-medium">
                                    <FiPhone />
                                </span>
                                <div className="relative flex-1">
                                    <p className="absolute translate-y-[50%] left-2 text-gray-600">+91</p>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={10}
                                        required
                                        className="w-full pl-10 pr-4 py-3 appearance-none border rounded-r-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                        style={{
                                            borderColor: "var(--air_superiority_blue-900)",
                                        }}
                                        placeholder="Enter 10-digit number"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{
                                    color: "var(--prussian_blue-500)",
                                }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <FiLock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    style={{
                                        color: "var(--air_superiority_blue-400)",
                                    }}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{
                                        borderColor: "var(--air_superiority_blue-900)",
                                    }}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    style={{
                                        color: "var(--air_superiority_blue-400)",
                                    }}
                                >
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                            style={{
                                background: "linear-gradient(90deg, var(--fire_brick-500), var(--barn_red-500))",
                                color: "#fff",
                            }}
                        >
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p
                            style={{
                                color: "var(--air_superiority_blue-400)",
                            }}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/auth/login"
                                className="font-medium hover:underline"
                                style={{ color: "var(--fire_brick-500)" }}
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
