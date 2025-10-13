import React from "react";
import { FiHome, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                                <FiHome className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Aangan</h3>
                                <p className="text-xs text-gray-400 -mt-1">Property Solutions</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your trusted partner in finding the perfect property. We connect you with the best real estate opportunities across India.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <FiLinkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-300">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Buy Properties
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Sell Properties
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Rent Properties
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Property Management
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Investment Opportunities
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-300">Services</h4>
                        <ul className="space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Property Valuation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Legal Documentation
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Home Loans
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Property Insurance
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Interior Design
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-300">Contact Us</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <FiMapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">123 Business District, Mumbai, Maharashtra 400001</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiPhone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FiMail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-300 text-sm">info@aangan.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">© 2024 Aangan. All rights reserved.</div>
                        <div className="flex space-x-6 text-sm">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
