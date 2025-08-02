"use client";
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ExternalLink, Play, Pause, ArrowRightLeft, ArrowRight } from 'lucide-react';
import ChatBot from '../component/ChatBot'

const NewsHomepage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exchangeRates, setExchangeRates] = useState({});
    const [currencyLoading, setCurrencyLoading] = useState(true);
    const [gbpAmount, setGbpAmount] = useState('');
    const [eurAmount, setEurAmount] = useState('');
    const [convertFrom, setConvertFrom] = useState('GBP'); // GBP or EUR
    const [properties, setProperties] = useState([]);
    const [loadingProperties, setLoadingProperties] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    useEffect(() => {
        const fetchNewsData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/news`, {
                    method: 'GET',
                    //credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Accept': '*/*',
                        //'Authorization': 'Bearer your-token',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setNewsData(data);
            } catch (err) {
                console.error('Error fetching news:', err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchRecentProperties = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/ukie/getRecentProperties`,
                    { method: 'GET', headers: { 'Content-Type': 'application/json' } }
                );
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setProperties(data);
            } catch (err) {
                console.error('Error fetching properties:', err.message);
            } finally {
                setLoadingProperties(false);
            }
        };

        const fetchExchangeRates = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/exchange-rates`, {
                    method: 'GET',
                    //credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        //'Accept': '*/*',
                        //'Authorization': 'Bearer your-token',
                    },
                });


                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setExchangeRates(data);
            } catch (err) {
                console.error('Error fetching exchange rates:', err.message);
            } finally {
                setCurrencyLoading(false);
            }
        };

        fetchNewsData();
        fetchRecentProperties();
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        if (token && userData) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % newsData.length);
    };

    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, currentSlide]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + newsData.length) % newsData.length);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IE', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getCategoryColor = (category) => {
        const colors = {
            world: 'bg-red-500',
            politics: 'bg-blue-500',
            sports: 'bg-green-500',
            top: 'bg-purple-500',
            default: 'bg-gray-500'
        };
        return colors[category?.[0]] || colors.default;
    };

    const handleCurrencyConversion = (value, fromCurrency) => {
        if (!value || !exchangeRates.GBP_EUR || !exchangeRates.EUR_GBP) return;

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        if (fromCurrency === 'GBP') {
            const converted = (numValue * exchangeRates.EUR_GBP).toFixed(2);
            setEurAmount(converted);
        } else {
            const converted = (numValue * exchangeRates.GBP_EUR).toFixed(2);
            setGbpAmount(converted);
        }
    };

    const handleGbpChange = (e) => {
        const value = e.target.value;
        setGbpAmount(value);
        setConvertFrom('GBP');
        handleCurrencyConversion(value, 'GBP');
    };

    const handleEurChange = (e) => {
        const value = e.target.value;
        setEurAmount(value);
        setConvertFrom('EUR');
        handleCurrencyConversion(value, 'EUR');
    };

    const swapCurrencies = () => {
        const tempGbp = gbpAmount;
        const tempEur = eurAmount;
        setGbpAmount(tempEur);
        setEurAmount(tempGbp);
        setConvertFrom(convertFrom === 'GBP' ? 'EUR' : 'GBP');
    };

    const clearAmounts = () => {
        setGbpAmount('');
        setEurAmount('');
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg text-gray-600">Loading news...</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Carousel Section */}
                <div className="relative mb-12">
                    <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-xl shadow-2xl">
                        <div
                            className="flex transition-transform duration-500 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {newsData.map((article, index) => (
                                <div key={article.id} className="w-full flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
                                    <img
                                        src={article.image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 z-20 flex items-center">
                                        <div className="px-8 lg:px-16 max-w-3xl">
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(article.category)}`}>
                                                    {article.category?.[0]?.toUpperCase() || 'NEWS'}
                                                </span>
                                                <div className="flex items-center text-white/80 text-sm">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {formatDate(article.pubDate)}
                                                </div>
                                            </div>
                                            <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                                {article.title}
                                            </h2>
                                            <p className="text-white/90 text-lg mb-6 leading-relaxed max-w-2xl">
                                                {article.description}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <a
                                                    href={article.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                                >
                                                    Read Full Story
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                </a>
                                                <span className="text-white/70 text-sm">
                                                    Source: {article.source_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-200"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-200"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>

                        <button
                            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                            className="absolute bottom-4 right-4 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-all duration-200"
                        >
                            {isAutoPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>

                    <div className="flex justify-center mt-6 space-x-2">
                        {newsData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                                    ? 'bg-blue-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* <PropertyAnalyticsDashboard /> */}

                {/* Secondary News Grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {newsData.slice(0, 6).map((article, index) => (
                        <div key={`grid-${article.id}`} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${getCategoryColor(article.category)}`}>
                                        {article.category?.[0]?.toUpperCase() || 'NEWS'}
                                    </span>
                                    <span className="text-gray-500 text-xs">
                                        {formatDate(article.pubDate)}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                                    {article.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {article.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">{article.source_name}</span>
                                    <a
                                        href={article.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Read more →
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}

                {/* Recent Properties Section */}
                {!isLoggedIn && <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest Properties</h2>

                    {loadingProperties ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="text-lg text-gray-600">Loading properties...</div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                {properties.slice(0, 5).map((p) => (
                                    <div
                                        key={p.id}
                                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden"
                                    >
                                        <img
                                            src={
                                                p.mainPhoto?.startsWith('http')
                                                    ? p.mainPhoto
                                                    : 'https://via.placeholder.com/400x250?text=No+Image'
                                            }
                                            alt={p.displayAddress}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 mb-1 truncate">{p.displayAddress}</h3>
                                            <p className="text-sm text-gray-600 mb-2 truncate">{p.propertyType}</p>
                                            <p className="text-lg font-semibold text-blue-600">{p.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mt-8">
                                <a
                                    href="/signup"
                                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                                >
                                    Sign up today for accessing all features
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </a>
                            </div>
                        </>
                    )}
                </div>}

                {/* Currency Converter */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Currency Converter</h2>

                    {currencyLoading ? (
                        <div className="text-center py-8">
                            <div className="text-gray-600">Loading exchange rates...</div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            {/* Exchange Rate Display */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
                                <div className="text-center">
                                    <div className="text-sm text-gray-600 mb-2">Current Exchange Rates</div>
                                    <div className="flex justify-center gap-8">
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">£1 GBP</div>
                                            <div className="text-sm text-gray-600">= €{exchangeRates.EUR_GBP?.toFixed(4) || 'N/A'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-900">€1 EUR</div>
                                            <div className="text-sm text-gray-600">= £{exchangeRates.GBP_EUR?.toFixed(4) || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Converter Interface */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                    {/* GBP Input */}
                                    <div>
                                        <label htmlFor="gbp" className="block text-sm font-medium text-gray-700 mb-2">
                                            British Pounds (£)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">£</span>
                                            <input
                                                id="gbp"
                                                type="number"
                                                value={gbpAmount}
                                                onChange={handleGbpChange}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* EUR Input */}
                                    <div>
                                        <label htmlFor="eur" className="block text-sm font-medium text-gray-700 mb-2">
                                            Euros (€)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">€</span>
                                            <input
                                                id="eur"
                                                type="number"
                                                value={eurAmount}
                                                onChange={handleEurChange}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Control Buttons */}
                                <div className="flex justify-center gap-4 pt-4">
                                    <button
                                        onClick={swapCurrencies}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                    >
                                        <ArrowRightLeft className="w-4 h-4" />
                                        Swap
                                    </button>
                                    <button
                                        onClick={clearAmounts}
                                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200"
                                    >
                                        Clear
                                    </button>
                                </div>

                                {/* Conversion Summary */}
                                {(gbpAmount || eurAmount) && (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <div className="text-sm text-gray-600">
                                            {convertFrom === 'GBP' && gbpAmount ? (
                                                <>£{gbpAmount} GBP = €{eurAmount} EUR</>
                                            ) : convertFrom === 'EUR' && eurAmount ? (
                                                <>€{eurAmount} EUR = £{gbpAmount} GBP</>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <ChatBot />
        </div>
    );
};

export default NewsHomepage;