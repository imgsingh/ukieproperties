import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    CircularProgress,
    Tabs,
    Tab,
    Alert
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ScatterChart,
    Scatter,
    Area,
    AreaChart,
    ComposedChart
} from 'recharts';
import { TrendingUp, Home, MapPin, Euro, BarChart3, Star, Building, Users, DollarSign } from 'lucide-react';
import { getFromLocalStorage } from '../utils/Common';

const PropertyAnalyticsDashboard = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedCurrency, setSelectedCurrency] = useState('All');
    const [selectedSource, setSelectedSource] = useState('All');
    const [activeTab, setActiveTab] = useState(0);

    // Sample data based on your actual structure
    useEffect(() => {
        setLoading(true);
        const fetchProperties = async () => {
            try {
                const token = getFromLocalStorage('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/getProperties`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProperties(data);
            } catch (err) {
                console.error('Error fetching properties:', err.message);
                throw err; // Re-throw the error if you want to handle it elsewhere
            } finally {
                setLoading(false);
            }
        };


        // const fetchProperties = async () => {
        //     setLoading(true);
        //     const sampleData = generateSampleDataBasedOnYourStructure();
        //     setProperties(sampleData);
        //     setLoading(false);
        // };
        fetchProperties();
    }, []);

    const generateSampleDataBasedOnYourStructure = async () => {
        //const data = [];

        // Dublin properties (Daft.ie style)
        // for (let i = 0; i < 200; i++) {
        //     const dublinAreas = ['Dublin 1', 'Dublin 2', 'Dublin 4', 'Dublin 8', 'Dublin 9', 'Dublin 15'];
        //     const berRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2'];
        //     data.push({
        //         _id: `daft_${i}`,
        //         source: 'Daft.ie',
        //         Address: `Property ${i + 1}, ${dublinAreas[Math.floor(Math.random() * dublinAreas.length)]}`,
        //         DisplayAddress: `Property ${i + 1}, ${dublinAreas[Math.floor(Math.random() * dublinAreas.length)]}`,
        //         Price: `€${Math.floor(Math.random() * 800000) + 200000}`,
        //         numericPrice: Math.floor(Math.random() * 800000) + 200000,
        //         currency: 'EUR',
        //         bedsString: Math.random() > 0.3 ? `${Math.floor(Math.random() * 4) + 1} bed` : '1 & 2 bed',
        //         bathString: Math.random() > 0.2 ? `${Math.floor(Math.random() * 3) + 1} bath` : 'MISSING',
        //         propertyClass: ['Apartments', 'Houses', 'Townhouses'][Math.floor(Math.random() * 3)],
        //         propertyType: ['To Let', 'For Sale'][Math.floor(Math.random() * 2)],
        //         berRating: berRatings[Math.floor(Math.random() * berRatings.length)],
        //         region: dublinAreas[Math.floor(Math.random() * dublinAreas.length)],
        //         country: 'Ireland',
        //         location: {
        //             coordinates: [-6.2 + Math.random() * 0.4, 53.3 + Math.random() * 0.2]
        //         },
        //         groupObject: {
        //             name: `Estate Agent ${Math.floor(Math.random() * 50) + 1}`,
        //             phone: `01 ${Math.floor(Math.random() * 9000000) + 1000000}`
        //         },
        //         createdOn: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
        //     });
        // }

        // UK properties (OnTheMarket style)
        // for (let i = 0; i < 150; i++) {
        //     const ukAreas = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Liverpool'];
        //     const propertyTypes = ['Detached house', 'Semi-detached house', 'Terraced house', 'Flat', 'Bungalow'];
        //     data.push({
        //         _id: `otm_${i}`,
        //         source: 'OnTheMarket',
        //         Address: `${Math.floor(Math.random() * 200) + 1} High Street, ${ukAreas[Math.floor(Math.random() * ukAreas.length)]}`,
        //         DisplayAddress: `${Math.floor(Math.random() * 200) + 1} High Street, ${ukAreas[Math.floor(Math.random() * ukAreas.length)]}`,
        //         Price: `£${Math.floor(Math.random() * 900000) + 150000}`,
        //         numericPrice: Math.floor(Math.random() * 900000) + 150000,
        //         currency: 'GBP',
        //         bedsString: Math.floor(Math.random() * 6) + 1,
        //         bathString: Math.floor(Math.random() * 4) + 1,
        //         propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        //         region: ukAreas[Math.floor(Math.random() * ukAreas.length)],
        //         country: 'UK',
        //         location: {
        //             coordinates: [-0.1 + Math.random() * 0.4, 51.5 + Math.random() * 0.2]
        //         },
        //         groupObject: {
        //             groupName: `UK Estate Agent ${Math.floor(Math.random() * 30) + 1}`,
        //             GroupPhoneNumber: `020 ${Math.floor(Math.random() * 90000000) + 10000000}`
        //         }
        //     });
        // }

        // Ireland regional properties (MyHome.ie style)
        // for (let i = 0; i < 100; i++) {
        //     const counties = ['Cork', 'Galway', 'Limerick', 'Waterford', 'Kilkenny', 'Monaghan', 'Donegal'];
        //     const propertyTypes = ['Detached House', 'Semi-Detached House', 'Terraced House', 'Apartment', 'Bungalow'];
        //     const berRatings = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2'];
        //     data.push({
        //         _id: `myhome_${i}`,
        //         source: 'MyHome.ie',
        //         Address: `${Math.floor(Math.random() * 50) + 1} Main Street, ${counties[Math.floor(Math.random() * counties.length)]}`,
        //         DisplayAddress: `${Math.floor(Math.random() * 50) + 1} Main Street, ${counties[Math.floor(Math.random() * counties.length)]}`,
        //         Price: `€${Math.floor(Math.random() * 500000) + 100000}`,
        //         numericPrice: Math.floor(Math.random() * 500000) + 100000,
        //         currency: 'EUR',
        //         bedsString: `${Math.floor(Math.random() * 5) + 1} beds`,
        //         bathString: `${Math.floor(Math.random() * 3) + 1} baths`,
        //         propertyClass: 'ResidentialForSale',
        //         propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
        //         berRating: berRatings[Math.floor(Math.random() * berRatings.length)],
        //         region: counties[Math.floor(Math.random() * counties.length)],
        //         country: 'Ireland',
        //         location: {
        //             coordinates: [-8 + Math.random() * 2, 52 + Math.random() * 3]
        //         },
        //         groupObject: {
        //             groupName: `DNG ${counties[Math.floor(Math.random() * counties.length)]}`,
        //             GroupPhoneNumber: `0${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 9000000) + 1000000}`
        //         },
        //         createdOn: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        //         ActivatedOn: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000).toISOString()
        //     });
        // }

        return data;
    };

    // Helper functions
    const extractBedroomCount = (bedsString) => {
        if (!bedsString) return 0;
        if (typeof bedsString === 'number') return bedsString;
        const match = bedsString.toString().match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    };

    const extractBathroomCount = (bathString) => {
        if (!bathString || bathString === 'MISSING') return 0;
        if (typeof bathString === 'number') return bathString;
        const match = bathString.toString().match(/(\d+)/);
        return match ? parseInt(match[1]) : 1;
    };

    const convertToEUR = (price, currency) => {
        const rates = { EUR: 1, GBP: 1.15, USD: 0.85 };
        return price * (rates[currency] || 1);
    };

    // Filter properties
    const filteredProperties = useMemo(() => {
        let filtered = properties;

        if (selectedRegion !== 'All') {
            filtered = filtered.filter(prop => prop.region === selectedRegion);
        }

        if (selectedCurrency !== 'All') {
            filtered = filtered.filter(prop => prop.currency === selectedCurrency);
        }

        if (selectedSource !== 'All') {
            filtered = filtered.filter(prop => prop.source === selectedSource);
        }

        return filtered;
    }, [properties, selectedRegion, selectedCurrency, selectedSource]);

    // Get unique values for filters
    const regions = useMemo(() => {
        const uniqueRegions = [...new Set(properties.map(prop => prop.region).filter(Boolean))];
        return ['All', ...uniqueRegions.sort()];
    }, [properties]);

    const currencies = useMemo(() => {
        const uniqueCurrencies = [...new Set(properties.map(prop => prop.currency).filter(Boolean))];
        return ['All', ...uniqueCurrencies.sort()];
    }, [properties]);

    const sources = useMemo(() => {
        const uniqueSources = [...new Set(properties.map(prop => prop.source).filter(Boolean))];
        return ['All', ...uniqueSources.sort()];
    }, [properties]);

    // Market statistics
    const marketStats = useMemo(() => {
        if (filteredProperties.length === 0) return {};

        const prices = filteredProperties.map(p => convertToEUR(p.numericPrice, p.currency));
        const totalProperties = filteredProperties.length;
        const avgPrice = prices.reduce((a, b) => a + b, 0) / totalProperties;
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const sortedPrices = prices.sort((a, b) => a - b);
        const medianPrice = sortedPrices[Math.floor(totalProperties / 2)];

        const sourceCount = {};
        const currencyCount = {};
        filteredProperties.forEach(prop => {
            sourceCount[prop.source] = (sourceCount[prop.source] || 0) + 1;
            currencyCount[prop.currency] = (currencyCount[prop.currency] || 0) + 1;
        });

        return {
            totalProperties,
            avgPrice: Math.round(avgPrice),
            maxPrice,
            minPrice,
            medianPrice,
            primarySource: Object.keys(sourceCount).reduce((a, b) => sourceCount[a] > sourceCount[b] ? a : b),
            primaryCurrency: Object.keys(currencyCount).reduce((a, b) => currencyCount[a] > currencyCount[b] ? a : b),
            uniqueRegions: regions.length - 1,
            avgBedrooms: Math.round(filteredProperties.reduce((sum, prop) => sum + extractBedroomCount(prop.bedsString), 0) / totalProperties * 10) / 10
        };
    }, [filteredProperties, regions]);

    // PART 2: Analytics Calculations (Add these to Part 1 after marketStats)

    // Analytics calculations
    const priceAnalytics = useMemo(() => {
        const regionData = {};
        filteredProperties.forEach(prop => {
            const region = prop.region || 'Unknown';
            if (!regionData[region]) {
                regionData[region] = { total: 0, count: 0, properties: [] };
            }
            const priceEUR = convertToEUR(prop.numericPrice, prop.currency);
            regionData[region].total += priceEUR;
            regionData[region].count += 1;
            regionData[region].properties.push({ ...prop, priceEUR });
        });

        return Object.entries(regionData).map(([region, data]) => ({
            name: region,
            averagePrice: Math.round(data.total / data.count),
            totalProperties: data.count,
            maxPrice: Math.max(...data.properties.map(p => p.priceEUR)),
            minPrice: Math.min(...data.properties.map(p => p.priceEUR))
        })).sort((a, b) => b.averagePrice - a.averagePrice);
    }, [filteredProperties]);

    const sourceDistribution = useMemo(() => {
        const sourceCount = {};
        filteredProperties.forEach(prop => {
            sourceCount[prop.source] = (sourceCount[prop.source] || 0) + 1;
        });

        return Object.entries(sourceCount).map(([source, count]) => ({
            name: source,
            value: count,
            percentage: ((count / filteredProperties.length) * 100).toFixed(1)
        }));
    }, [filteredProperties]);

    const propertyTypeAnalysis = useMemo(() => {
        const typeCount = {};
        filteredProperties.forEach(prop => {
            let type = prop.propertyType || prop.propertyClass || 'Unknown';
            if (Array.isArray(type)) type = type[0];
            typeCount[type] = (typeCount[type] || 0) + 1;
        });

        return Object.entries(typeCount).map(([type, count]) => ({
            name: type,
            value: count
        })).slice(0, 8);
    }, [filteredProperties]);

    const currencyDistribution = useMemo(() => {
        const currencyCount = {};
        const currencyValue = {};

        filteredProperties.forEach(prop => {
            const currency = prop.currency || 'Unknown';
            currencyCount[currency] = (currencyCount[currency] || 0) + 1;
            currencyValue[currency] = (currencyValue[currency] || 0) + prop.numericPrice;
        });

        return Object.entries(currencyCount).map(([currency, count]) => ({
            currency,
            properties: count,
            totalValue: currencyValue[currency],
            averageValue: Math.round(currencyValue[currency] / count)
        }));
    }, [filteredProperties]);

    const berRatingDistribution = useMemo(() => {
        const berCount = {};
        filteredProperties.forEach(prop => {
            const ber = prop.berRating || 'Not Available';
            berCount[ber] = (berCount[ber] || 0) + 1;
        });

        return Object.entries(berCount).map(([rating, count]) => ({
            name: rating,
            value: count
        })).sort((a, b) => {
            if (a.name === 'Not Available') return 1;
            if (b.name === 'Not Available') return -1;
            return a.name.localeCompare(b.name);
        });
    }, [filteredProperties]);

    const bedroomAnalysis = useMemo(() => {
        const bedroomCount = {};
        filteredProperties.forEach(prop => {
            const bedrooms = extractBedroomCount(prop.bedsString);
            const key = bedrooms === 0 ? 'Not specified' : `${bedrooms} Bedroom${bedrooms > 1 ? 's' : ''}`;
            bedroomCount[key] = (bedroomCount[key] || 0) + 1;
        });

        return Object.entries(bedroomCount).map(([bedrooms, count]) => ({
            name: bedrooms,
            value: count
        }));
    }, [filteredProperties]);

    const priceRangeAnalysis = useMemo(() => {
        const ranges = {
            '€0-200k': 0,
            '€200k-400k': 0,
            '€400k-600k': 0,
            '€600k-800k': 0,
            '€800k+': 0
        };

        filteredProperties.forEach(prop => {
            const priceEUR = convertToEUR(prop.numericPrice, prop.currency);
            if (priceEUR < 200000) ranges['€0-200k']++;
            else if (priceEUR < 400000) ranges['€200k-400k']++;
            else if (priceEUR < 600000) ranges['€400k-600k']++;
            else if (priceEUR < 800000) ranges['€600k-800k']++;
            else ranges['€800k+']++;
        });

        return Object.entries(ranges).map(([range, count]) => ({
            name: range,
            value: count,
            percentage: ((count / filteredProperties.length) * 100).toFixed(1)
        }));
    }, [filteredProperties]);

    const agentPerformance = useMemo(() => {
        const agentStats = {};
        filteredProperties.forEach(prop => {
            const agent = prop.groupObject?.name || prop.groupObject?.groupName || 'Unknown Agent';
            if (!agentStats[agent]) {
                agentStats[agent] = { count: 0, totalValue: 0, properties: [] };
            }
            const priceEUR = convertToEUR(prop.numericPrice, prop.currency);
            agentStats[agent].count += 1;
            agentStats[agent].totalValue += priceEUR;
            agentStats[agent].properties.push(prop);
        });

        return Object.entries(agentStats)
            .map(([agent, stats]) => ({
                name: agent,
                properties: stats.count,
                totalValue: stats.totalValue,
                averageValue: Math.round(stats.totalValue / stats.count),
                marketShare: ((stats.count / filteredProperties.length) * 100).toFixed(1)
            }))
            .sort((a, b) => b.properties - a.properties)
            .slice(0, 10); // Top 10 agents
    }, [filteredProperties]);

    const monthlyTrends = useMemo(() => {
        const monthlyData = {};
        filteredProperties.forEach(prop => {
            if (prop.createdOn) {
                const date = new Date(prop.createdOn);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = { count: 0, totalValue: 0 };
                }
                monthlyData[monthKey].count += 1;
                monthlyData[monthKey].totalValue += convertToEUR(prop.numericPrice, prop.currency);
            }
        });

        return Object.entries(monthlyData)
            .map(([month, data]) => ({
                month,
                properties: data.count,
                averagePrice: Math.round(data.totalValue / data.count),
                totalValue: data.totalValue
            }))
            .sort((a, b) => a.month.localeCompare(b.month))
            .slice(-12); // Last 12 months
    }, [filteredProperties]);

    const marketHealthIndicators = useMemo(() => {
        if (filteredProperties.length === 0) return {};

        const prices = filteredProperties.map(p => convertToEUR(p.numericPrice, p.currency));
        const priceVariance = prices.reduce((sum, price) => sum + Math.pow(price - marketStats.avgPrice, 2), 0) / prices.length;
        const priceStdDev = Math.sqrt(priceVariance);

        // Calculate market liquidity (properties per agent)
        const agentCount = new Set(filteredProperties.map(p => p.groupObject?.name || p.groupObject?.groupName)).size;
        const liquidity = filteredProperties.length / agentCount;

        // Calculate market diversity (property types)
        const typeCount = new Set(filteredProperties.map(p => p.propertyType || p.propertyClass)).size;
        const diversity = typeCount / filteredProperties.length;

        // Calculate regional concentration
        const regionCounts = {};
        filteredProperties.forEach(prop => {
            regionCounts[prop.region] = (regionCounts[prop.region] || 0) + 1;
        });
        const maxRegionShare = Math.max(...Object.values(regionCounts)) / filteredProperties.length;

        return {
            volatility: Math.round((priceStdDev / marketStats.avgPrice) * 100), // CV as percentage
            liquidity: Math.round(liquidity * 10) / 10,
            diversity: Math.round(diversity * 1000) / 1000,
            concentration: Math.round(maxRegionShare * 100), // Percentage
            dataQuality: Math.round((filteredProperties.filter(p => p.berRating && p.berRating !== 'Not Available').length / filteredProperties.length) * 100)
        };
    }, [filteredProperties, marketStats]);

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0', '#a4de6c', '#ffc0cb'];

    // Regional comparison with more detailed metrics
    const regionalComparison = useMemo(() => {
        const regionMetrics = {};

        filteredProperties.forEach(prop => {
            const region = prop.region || 'Unknown';
            if (!regionMetrics[region]) {
                regionMetrics[region] = {
                    properties: [],
                    sources: new Set(),
                    currencies: new Set(),
                    propertyTypes: new Set(),
                    agents: new Set()
                };
            }

            const priceEUR = convertToEUR(prop.numericPrice, prop.currency);
            regionMetrics[region].properties.push({
                price: priceEUR,
                bedrooms: extractBedroomCount(prop.bedsString),
                bathrooms: extractBathroomCount(prop.bathString),
                ber: prop.berRating,
                type: prop.propertyType || prop.propertyClass
            });

            regionMetrics[region].sources.add(prop.source);
            regionMetrics[region].currencies.add(prop.currency);
            regionMetrics[region].propertyTypes.add(prop.propertyType || prop.propertyClass);
            regionMetrics[region].agents.add(prop.groupObject?.name || prop.groupObject?.groupName);
        });

        return Object.entries(regionMetrics).map(([region, data]) => {
            const prices = data.properties.map(p => p.price);
            const bedrooms = data.properties.map(p => p.bedrooms);

            return {
                region,
                totalProperties: data.properties.length,
                averagePrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
                medianPrice: prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
                priceRange: Math.max(...prices) - Math.min(...prices),
                averageBedrooms: Math.round((bedrooms.reduce((a, b) => a + b, 0) / bedrooms.length) * 10) / 10,
                sourceDiversity: data.sources.size,
                currencyTypes: data.currencies.size,
                propertyTypesCount: data.propertyTypes.size,
                agentCount: data.agents.size,
                marketShare: ((data.properties.length / filteredProperties.length) * 100).toFixed(1),
                berAvailability: ((data.properties.filter(p => p.ber && p.ber !== 'Not Available').length / data.properties.length) * 100).toFixed(1)
            };
        }).sort((a, b) => b.totalProperties - a.totalProperties);
    }, [filteredProperties]);

    // Property size analysis (if size data available)
    const propertySizeAnalysis = useMemo(() => {
        // Estimate size based on bedrooms (simplified)
        const sizeEstimates = filteredProperties.map(prop => {
            const bedrooms = extractBedroomCount(prop.bedsString);
            const estimatedSize = bedrooms * 40 + 50; // Rough estimate: 40sqm per bedroom + 50sqm common
            const priceEUR = convertToEUR(prop.numericPrice, prop.currency);
            return {
                estimatedSize,
                price: priceEUR,
                pricePerSqm: Math.round(priceEUR / estimatedSize),
                bedrooms,
                region: prop.region,
                type: prop.propertyType || prop.propertyClass
            };
        });

        const sizeRanges = {
            'Small (0-75 sqm)': sizeEstimates.filter(p => p.estimatedSize <= 75),
            'Medium (76-125 sqm)': sizeEstimates.filter(p => p.estimatedSize > 75 && p.estimatedSize <= 125),
            'Large (126-200 sqm)': sizeEstimates.filter(p => p.estimatedSize > 125 && p.estimatedSize <= 200),
            'Extra Large (200+ sqm)': sizeEstimates.filter(p => p.estimatedSize > 200)
        };

        return Object.entries(sizeRanges).map(([range, properties]) => ({
            name: range,
            count: properties.length,
            averagePrice: properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.price, 0) / properties.length) : 0,
            averagePricePerSqm: properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + p.pricePerSqm, 0) / properties.length) : 0,
            percentage: ((properties.length / sizeEstimates.length) * 100).toFixed(1)
        }));
    }, [filteredProperties]);

    const TabPanel = ({ children, value, index }) => (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BarChart3 size={40} />
                    Multi-Source Property Market Analytics
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Comprehensive analysis across Daft.ie, OnTheMarket, and MyHome.ie
                </Typography>
            </Paper>

            {/* Filters */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Region Filter</InputLabel>
                            <Select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                label="Region Filter"
                            >
                                {regions.map(region => (
                                    <MenuItem key={region} value={region}>{region}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Currency</InputLabel>
                            <Select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                label="Currency"
                            >
                                {currencies.map(currency => (
                                    <MenuItem key={currency} value={currency}>{currency}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Data Source</InputLabel>
                            <Select
                                value={selectedSource}
                                onChange={(e) => setSelectedSource(e.target.value)}
                                label="Data Source"
                            >
                                {sources.map(source => (
                                    <MenuItem key={source} value={source}>{source}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                                icon={<Home size={16} />}
                                label={`${filteredProperties.length} Properties`}
                                color="primary"
                                variant="outlined"
                            />
                            <Chip
                                icon={<MapPin size={16} />}
                                label={`${marketStats.uniqueRegions} Regions`}
                                color="secondary"
                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Key Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Home size={20} />
                                Properties
                            </Typography>
                            <Typography variant="h4">{marketStats.totalProperties?.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Across {marketStats.uniqueRegions} regions
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Euro size={20} />
                                Avg Price (EUR)
                            </Typography>
                            <Typography variant="h4">€{marketStats.avgPrice?.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                {marketStats.avgBedrooms} avg bedrooms
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Max Price</Typography>
                            <Typography variant="h4">€{marketStats.maxPrice?.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Premium properties
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Primary Source</Typography>
                            <Typography variant="h5">{marketStats.primarySource}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Main data provider
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                        <CardContent>
                            <Typography variant="h6">Primary Currency</Typography>
                            <Typography variant="h4">{marketStats.primaryCurrency}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Most common
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                    <Card elevation={3} sx={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', color: '#333' }}>
                        <CardContent>
                            <Typography variant="h6">Median Price</Typography>
                            <Typography variant="h4">€{marketStats.medianPrice?.toLocaleString()}</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Market center
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tab Navigation */}
            <Paper elevation={2} sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Regional Analysis" />
                    <Tab label="Data Sources" />
                    <Tab label="Property Types" />
                    <Tab label="Energy Ratings" />
                    <Tab label="Currency Analysis" />
                    <Tab label="Market Summary" />
                </Tabs>
            </Paper>

            {/* Tab Content */}
            <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUp size={20} />
                                Average Property Prices by Region (EUR equivalent)
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={priceAnalytics}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Average Price']} />
                                    <Legend />
                                    <Bar dataKey="averagePrice" fill="#8884d8" name="Average Price" />
                                    <Bar dataKey="totalProperties" yAxisId="right" fill="#82ca9d" name="Property Count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Regional Comparison Table</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Region</strong></TableCell>
                                            <TableCell><strong>Properties</strong></TableCell>
                                            <TableCell><strong>Avg Price (EUR)</strong></TableCell>
                                            <TableCell><strong>Market Share</strong></TableCell>
                                            <TableCell><strong>Sources</strong></TableCell>
                                            <TableCell><strong>BER Available</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {regionalComparison.slice(0, 10).map((region) => (
                                            <TableRow key={region.region}>
                                                <TableCell>{region.region}</TableCell>
                                                <TableCell>{region.totalProperties.toLocaleString()}</TableCell>
                                                <TableCell>€{region.averagePrice.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {region.marketShare}%
                                                        <Box
                                                            sx={{
                                                                width: 50,
                                                                height: 8,
                                                                backgroundColor: '#e0e0e0',
                                                                borderRadius: 4,
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: `${region.marketShare}%`,
                                                                    height: '100%',
                                                                    backgroundColor: '#1976d2'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{region.sourceDiversity}</TableCell>
                                                <TableCell>{region.berAvailability}%</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Building size={20} />
                                Properties by Data Source
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={sourceDistribution}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    >
                                        {sourceDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Top Estate Agents</Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={agentPerformance.slice(0, 8)}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => [
                                        name === 'properties' ? value.toLocaleString() : `€${value.toLocaleString()}`,
                                        name === 'properties' ? 'Properties' : 'Average Value'
                                    ]} />
                                    <Bar dataKey="properties" fill="#8884d8" name="Properties" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Currency Distribution Details</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Currency</strong></TableCell>
                                            <TableCell><strong>Properties</strong></TableCell>
                                            <TableCell><strong>Total Value</strong></TableCell>
                                            <TableCell><strong>Avg Value</strong></TableCell>
                                            <TableCell><strong>Market Share</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currencyDistribution.map((item) => (
                                            <TableRow key={item.currency}>
                                                <TableCell>
                                                    <Chip label={item.currency} color="primary" variant="outlined" />
                                                </TableCell>
                                                <TableCell>{item.properties.toLocaleString()}</TableCell>
                                                <TableCell>{item.currency} {item.totalValue.toLocaleString()}</TableCell>
                                                <TableCell>{item.currency} {item.averageValue.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {((item.properties / filteredProperties.length) * 100).toFixed(1)}%
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Property Types Distribution</Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={propertyTypeAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        angle={-45}
                                        textAnchor="end"
                                        height={100}
                                    />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Bedroom Distribution</Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={bedroomAnalysis}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={120}
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {bedroomAnalysis.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Price Range Analysis</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={priceRangeAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => [
                                        name === 'value' ? value.toLocaleString() : `${value}%`,
                                        name === 'value' ? 'Properties' : 'Percentage'
                                    ]} />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Property Size Analysis (Estimated)</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={propertySizeAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip formatter={(value, name) => [
                                        name.includes('Price') ? `€${value.toLocaleString()}` : value,
                                        name
                                    ]} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Property Count" />
                                    <Line yAxisId="right" type="monotone" dataKey="averagePrice" stroke="#ff7300" name="Average Price" strokeWidth={3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Star size={20} />
                                Building Energy Rating (BER) Distribution
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={berRatingDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Energy Efficiency Insights</Typography>
                            <Box sx={{ mt: 2 }}>
                                {berRatingDistribution.slice(0, 5).map((rating, index) => (
                                    <Card key={rating.name} elevation={1} sx={{ mb: 2, p: 2 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography variant="h6">{rating.name}</Typography>
                                            <Chip
                                                label={rating.value}
                                                color={rating.name.startsWith('A') ? 'success' :
                                                    rating.name.startsWith('B') ? 'primary' :
                                                        rating.name.startsWith('C') ? 'warning' : 'error'}
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {((rating.value / filteredProperties.length) * 100).toFixed(1)}% of properties
                                        </Typography>
                                    </Card>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DollarSign size={20} />
                                Currency Analysis - Market Coverage
                            </Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <ComposedChart data={currencyDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="currency" />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip formatter={(value, name) => [
                                        name === 'properties' ? value.toLocaleString() :
                                            `${currencyDistribution.find(c => c.properties === value || c.averageValue === value)?.currency || ''} ${value.toLocaleString()}`,
                                        name
                                    ]} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="properties" fill="#8884d8" name="Number of Properties" />
                                    <Line yAxisId="right" type="monotone" dataKey="averageValue" stroke="#ff7300" name="Average Value" strokeWidth={3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Monthly Trends</Typography>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={monthlyTrends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="month"
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis yAxisId="left" />
                                    <YAxis yAxisId="right" orientation="right" />
                                    <Tooltip formatter={(value, name) => [
                                        name === 'properties' ? value : `€${value.toLocaleString()}`,
                                        name === 'properties' ? 'Properties Listed' : 'Average Price'
                                    ]} />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="properties" fill="#8884d8" name="Properties" />
                                    <Line yAxisId="right" type="monotone" dataKey="averagePrice" stroke="#ff7300" name="Avg Price" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={5}>
                <Grid container spacing={3}>
                    {/* Market Health Indicators */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Market Health Indicators</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Alert severity={marketHealthIndicators.volatility > 50 ? "warning" : "info"} sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Price Volatility:</strong> {marketHealthIndicators.volatility}%
                                        {marketHealthIndicators.volatility > 50 ? " (High)" : " (Moderate)"}
                                    </Typography>
                                </Alert>

                                <Alert severity="success" sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Market Liquidity:</strong> {marketHealthIndicators.liquidity} properties per agent
                                    </Typography>
                                </Alert>

                                <Alert severity={marketHealthIndicators.dataQuality > 70 ? "success" : "warning"} sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Data Quality:</strong> {marketHealthIndicators.dataQuality}% have BER ratings
                                    </Typography>
                                </Alert>

                                <Alert severity={marketHealthIndicators.concentration > 40 ? "warning" : "info"} sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Regional Concentration:</strong> {marketHealthIndicators.concentration}% in largest region
                                    </Typography>
                                </Alert>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Summary Statistics */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Market Summary</Typography>
                            <Card sx={{ p: 2, mt: 2 }}>
                                <Typography variant="subtitle1" gutterBottom>Key Insights</Typography>
                                <Typography variant="body2" paragraph>
                                    • Total market coverage: {marketStats.totalProperties?.toLocaleString()} properties
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    • Price range: €{marketStats.minPrice?.toLocaleString()} - €{marketStats.maxPrice?.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    • Primary market: {marketStats.primaryCurrency} properties from {marketStats.primarySource}
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    • Geographic coverage: {marketStats.uniqueRegions} regions
                                </Typography>
                                <Typography variant="body2">
                                    • Average property size: {marketStats.avgBedrooms} bedrooms
                                </Typography>
                            </Card>
                        </Paper>
                    </Grid>

                    {/* Comprehensive Regional Summary Table */}
                    <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Building size={20} />
                                Comprehensive Regional Analysis
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Region</strong></TableCell>
                                            <TableCell><strong>Properties</strong></TableCell>
                                            <TableCell><strong>Avg Price (EUR)</strong></TableCell>
                                            <TableCell><strong>Price Range</strong></TableCell>
                                            <TableCell><strong>Avg Bedrooms</strong></TableCell>
                                            <TableCell><strong>Data Sources</strong></TableCell>
                                            <TableCell><strong>Agents</strong></TableCell>
                                            <TableCell><strong>Market Share</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {regionalComparison.map((region) => (
                                            <TableRow key={region.region}>
                                                <TableCell>
                                                    <Typography variant="subtitle2">{region.region}</Typography>
                                                </TableCell>
                                                <TableCell>{region.totalProperties.toLocaleString()}</TableCell>
                                                <TableCell>€{region.averagePrice.toLocaleString()}</TableCell>
                                                <TableCell>€{region.priceRange.toLocaleString()}</TableCell>
                                                <TableCell>{region.averageBedrooms}</TableCell>
                                                <TableCell>
                                                    <Chip label={region.sourceDiversity} size="small" color="primary" />
                                                </TableCell>
                                                <TableCell>{region.agentCount}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <Typography variant="body2">
                                                            {region.marketShare}%
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                width: 50,
                                                                height: 8,
                                                                backgroundColor: '#e0e0e0',
                                                                borderRadius: 4,
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: `${region.marketShare}%`,
                                                                    height: '100%',
                                                                    backgroundColor: '#1976d2'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </TabPanel>
        </Box>
    );
};

export default PropertyAnalyticsDashboard;