import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { loginUser } from "../../backend/auth";
import { useUser } from "../../utils/userContext";

const Login = () => {
    const { user, setUser } = useUser();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        document.title = "Login | Aangan - Property Solutions";
    }, []);

    useEffect(() => {
        // ✅ Only redirect if user exists and is authenticated
        if (user && user.email) {
            navigate("/user/dashboard");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const data = await loginUser(formData.email, formData.password);
            setUser(data.user.user_metadata);
            // Wait for Supabase to persist session
            setTimeout(() => {
                navigate("/user/dashboard");
            }, 2000); // 2000ms delay to allow session persistence

            console.log("login success");
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
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
                                style={{ background: "linear-gradient(135deg, var(--fire_brick-500), var(--barn_red-500))" }}
                            >
                                <FiMail className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ color: "var(--prussian_blue-500)" }}
                        >
                            Welcome Back
                        </h1>
                        <p style={{ color: "var(--air_superiority_blue-400)" }}>Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && <div className="mb-4 p-3 text-center text-sm rounded-lg bg-red-50 text-red-600 font-medium">{error}</div>}

                    {/* Login Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Email Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{ borderColor: "var(--air_superiority_blue-900)" }}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                className="block text-sm font-medium mb-2"
                                style={{ color: "var(--prussian_blue-500)" }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <FiLock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all duration-200"
                                    style={{ borderColor: "var(--air_superiority_blue-900)" }}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                >
                                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    style={{ accentColor: "var(--prussian_blue-500)" }}
                                />
                                <span
                                    className="text-sm"
                                    style={{ color: "var(--air_superiority_blue-400)" }}
                                >
                                    Remember me
                                </span>
                            </label>
                            <Link
                                to="/auth/forgot-password"
                                className="text-sm hover:underline"
                                style={{ color: "var(--fire_brick-500)" }}
                            >
                                Forgot password?
                            </Link>
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
                            {isLoading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p style={{ color: "var(--air_superiority_blue-400)" }}>
                            Don't have an account?{" "}
                            <Link
                                to="/auth/signup"
                                className="font-medium hover:underline"
                                style={{ color: "var(--fire_brick-500)" }}
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div className="mt-4 text-center">
                        <Link
                            to="/"
                            className="text-sm hover:underline"
                            style={{ color: "var(--air_superiority_blue-400)" }}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
