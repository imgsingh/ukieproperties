"use client"
import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleApiRequest = async (endpoint, action) => {
        if (!email.trim()) {
            setMessage('Email is required');
            setMessageType('error');
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Invalid email format');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://localhost:8080/ukie/api/newsletter/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (response.ok) {
                setMessage(`Successfully ${action}d!`);
                setMessageType('success');
                setEmail(''); // Clear email on success
            } else {
                const errorData = await response.text();
                setMessage(errorData || `Failed to ${action}`);
                setMessageType('error');
            }
        } catch (error) {
            setMessage(`Network error. Please try again.`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    const handleSubscribe = () => {
        handleApiRequest('subscribe', 'subscribe');
    };

    return (
        <footer className="bg-gray-900 text-white relative">
            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
            >
                <ArrowUp className="w-5 h-5" />
            </button>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Company Info */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-bold text-blue-400 mb-2">UKIreland Properties</h2>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Your trusted partner in finding the perfect property in the UK and Ireland.
                                We provide comprehensive property solutions with expert guidance every step of the way.
                            </p>
                        </div>

                        {/* Social Media Links */}
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">Home</a></li>
                            <li><a href="/properties" className="text-gray-300 hover:text-white transition-colors duration-200">Properties</a></li>
                            <li><a href="/buy" className="text-gray-300 hover:text-white transition-colors duration-200">Buy</a></li>
                            <li><a href="/rent" className="text-gray-300 hover:text-white transition-colors duration-200">Rent</a></li>
                            <li><a href="/sell" className="text-gray-300 hover:text-white transition-colors duration-200">Sell</a></li>
                            <li><a href="/news" className="text-gray-300 hover:text-white transition-colors duration-200">Market News</a></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-400">Services</h3>
                        <ul className="space-y-2">
                            <li><a href="/valuation" className="text-gray-300 hover:text-white transition-colors duration-200">Property Valuation</a></li>
                            <li><a href="/mortgage" className="text-gray-300 hover:text-white transition-colors duration-200">Mortgage Advice</a></li>
                            <li><a href="/investment" className="text-gray-300 hover:text-white transition-colors duration-200">Investment Properties</a></li>
                            <li><a href="/commercial" className="text-gray-300 hover:text-white transition-colors duration-200">Commercial Properties</a></li>
                            <li><a href="/legal" className="text-gray-300 hover:text-white transition-colors duration-200">Legal Services</a></li>
                            <li><a href="/insurance" className="text-gray-300 hover:text-white transition-colors duration-200">Property Insurance</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-400">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-300 text-sm">
                                    <p>123 Property Street</p>
                                    <p>Dublin, D02 XY12</p>
                                    <p>Ireland</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <a href="tel:+353123456789" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    +353 1 234 5678
                                </a>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <a href="mailto:info@ukieproperties.com" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    info@ukieproperties.com
                                </a>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="mt-6">
                            <h4 className="text-sm font-semibold text-blue-400 mb-2">Business Hours</h4>
                            <div className="text-gray-300 text-sm space-y-1">
                                <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="max-w-md mx-auto text-center">
                        <h3 className="text-lg font-semibold mb-2 text-blue-400">Stay Updated</h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Subscribe to our newsletter for the latest property news and market insights.
                        </p>
                        <div className="flex space-x-2">
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                                value={email}
                                disabled={isLoading}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {message && (
                                <div className={`mb-4 p-3 rounded-lg text-sm ${messageType === 'success'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                    {message}
                                </div>
                            )}
                            <button
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                                onClick={handleSubscribe}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-400 text-sm">
                            © {currentYear} UKIreland Properties. All rights reserved.
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Privacy Policy
                            </a>
                            <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Terms of Service
                            </a>
                            <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Cookie Policy
                            </a>
                            <a href="/accessibility" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Accessibility
                            </a>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="text-center text-xs text-gray-500">
                        <p>UKIreland Properties is regulated by the Property Services Regulatory Authority (PSRA)</p>
                        <p className="mt-1">License No: 12345 | VAT No: IE1234567X</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;