"use client"
import React, { useEffect, useMemo, useState } from 'react';
import toastr from '../utils/toastrConfig';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Autocomplete,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputAdornment
} from '@mui/material';
import { styled } from '@mui/system';

const ListPage = () => {
    const [searchRadius, setSearchRadius] = useState('0.0');
    const [priceRange, setPriceRange] = useState({ min: '0', max: '0' });
    const [numBedrooms, setNumBedrooms] = useState({ min: '0', max: '0' });
    const [counties, setCounties] = useState([]);
    const [currency, setCurrency] = useState("0"); //0 is EUR and 1 is GBP
    const [selectedCounty, setSelectedCounty] = useState("Maynooth");
    const [keyword, setKeyword] = useState("");
    const [properties, setProperties] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortOption, setSortOption] = useState('address-asc');


    const StyledPaper = styled(Paper)(({ theme }) => ({
        borderRadius: theme.spacing(2),
        backgroundColor: '#f5f5f5',
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
    }));

    const StyledButton = styled(Button)(({ theme }) => ({
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        backgroundColor: '#1976d2',
        color: 'white',
        '&:hover': {
            backgroundColor: '#1565c0',
        },
    }));

    const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: theme.spacing(1),
    }));

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        padding: theme.spacing(2),
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    }));


    const handleSearch = () => {
        fetch("http://localhost:8080/ukie/searchProperties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                county: selectedCounty,
                sr: searchRadius,
                pr: priceRange,
                curr: currency,
                nb: numBedrooms,
                keyword: keyword
            })
        })
            .then((response) => response.json())
            .then((data) => {
                setProperties(data)
                if (data.length == 0) {
                    toastr.info('No properties found for this region!!');
                }
            })
            .catch((error) =>
                console.error("Error searching properties API:", error)
            );
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function extractNumbers(str) {
        const cleanedStr = str.replace(/,/g, ''); // Remove all commas
        const matches = cleanedStr.match(/[-+]?\d*\.\d+|\d+/g);
        return matches ? matches.map(Number) : [];
    }

    const sortedProperties = useMemo(() => {
        let sorted = [...properties];
        switch (sortOption) {
            case 'address-asc':
                sorted.sort((a, b) => a.address?.localeCompare(b.address) || 0); // Handle null/undefined
                break;
            case 'address-desc':
                sorted.sort((a, b) => b.address?.localeCompare(a.address) || 0); // Handle null/undefined
                break;
            case 'price-asc':
                sorted.sort((a, b) => (parseFloat(extractNumbers(a.price.replace('k', '000'))) || 0) - (parseFloat(extractNumbers(b.price.replace('k', '000'))) || 0)); // Parse price, handle NaN
                break;
            case 'price-desc':
                sorted.sort((a, b) => (parseFloat(extractNumbers(b.price.replace('k', '000'))) || 0) - (parseFloat(extractNumbers(a.price.replace('k', '000'))) || 0)); // Parse price, handle NaN
                break;
            default:
                break;
        }
        return sorted;
    }, [properties, sortOption]);

    const displayedProperties = useMemo(() => {
        return sortedProperties.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedProperties, page, rowsPerPage]);

    useEffect(() => {
        fetch("http://localhost:8080/ukie/getCounties", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.json())
            .then((data) => {
                setCounties(data); // Only update when necessary
            })
            .catch((error) => console.error("Error calling counties API:", error));

        setIsClient(true);
    }, [])

    if (!isClient) {
        return null; // This will prevent server-side rendering issues
    }

    return (
        <Box sx={{ flexGrow: 1, padding: '30px' }}>
            <StyledPaper elevation={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Typography variant="h5" component="h2">
                            Search Properties
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <FormControl sx={{ minWidth: 300, marginRight: 2 }}>
                            <Box sx={{ marginRight: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Select Region
                                </Typography>
                                <Autocomplete
                                    disablePortal
                                    options={counties}
                                    value={selectedCounty}
                                    onChange={(event, newValue) => setSelectedCounty(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </Box>
                        </FormControl>
                        <FormControl sx={{ minWidth: 300 }}>
                            <Box sx={{ marginRight: 2 }}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                    Search Radius
                                </Typography>
                                <Select
                                    value={searchRadius}
                                    onChange={(e) => setSearchRadius(e.target.value)}
                                    sx={{ width: 300 }}
                                >
                                    <MenuItem value="0.0">+ 0 miles</MenuItem>
                                    <MenuItem value="0.25">+ 1/4 mile</MenuItem>
                                    <MenuItem value="0.5">+ 1/2 mile</MenuItem>
                                    <MenuItem value="1.0">+ 1 mile</MenuItem>
                                    <MenuItem value="3.0">+ 3 miles</MenuItem>
                                    <MenuItem value="5.0">+ 5 miles</MenuItem>
                                    <MenuItem value="10.0">+ 10 miles</MenuItem>
                                    <MenuItem value="15.0">+ 15 miles</MenuItem>
                                    <MenuItem value="20.0">+ 20 miles</MenuItem>
                                    <MenuItem value="30.0">+ 30 miles</MenuItem>
                                    <MenuItem value="40.0">+ 40 miles</MenuItem>
                                </Select>
                            </Box>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Box sx={{ marginRight: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Price
                            </Typography>
                            <Select
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                sx={{ mr: 1, minWidth: 100 }}
                            >
                                <MenuItem value="0">Min</MenuItem><MenuItem value="25000">25000</MenuItem><MenuItem value="50000">50000</MenuItem><MenuItem value="75000">75000</MenuItem><MenuItem value="100000">100000</MenuItem><MenuItem value="125000">125000</MenuItem><MenuItem value="150000">150000</MenuItem><MenuItem value="175000">175000</MenuItem><MenuItem value="200000">200000</MenuItem><MenuItem value="225000">225000</MenuItem><MenuItem value="250000">250000</MenuItem><MenuItem value="275000">275000</MenuItem><MenuItem value="300000">300000</MenuItem><MenuItem value="325000">325000</MenuItem><MenuItem value="350000">350000</MenuItem><MenuItem value="375000">375000</MenuItem><MenuItem value="400000">400000</MenuItem><MenuItem value="425000">425000</MenuItem><MenuItem value="450000">450000</MenuItem><MenuItem value="475000">475000</MenuItem><MenuItem value="500000">500000</MenuItem><MenuItem value="525000">525000</MenuItem><MenuItem value="550000">550000</MenuItem><MenuItem value="575000">575000</MenuItem><MenuItem value="600000">600000</MenuItem><MenuItem value="625000">625000</MenuItem><MenuItem value="650000">650000</MenuItem><MenuItem value="675000">675000</MenuItem><MenuItem value="700000">700000</MenuItem><MenuItem value="725000">725000</MenuItem><MenuItem value="750000">750000</MenuItem><MenuItem value="775000">775000</MenuItem><MenuItem value="800000">800000</MenuItem><MenuItem value="825000">825000</MenuItem><MenuItem value="850000">850000</MenuItem><MenuItem value="875000">875000</MenuItem><MenuItem value="900000">900000</MenuItem><MenuItem value="925000">925000</MenuItem><MenuItem value="950000">950000</MenuItem><MenuItem value="975000">975000</MenuItem><MenuItem value="1000000">1000000</MenuItem><MenuItem value="1100000">1100000</MenuItem><MenuItem value="1200000">1200000</MenuItem><MenuItem value="1300000">1300000</MenuItem><MenuItem value="1400000">1400000</MenuItem><MenuItem value="1500000">1500000</MenuItem><MenuItem value="1600000">1600000</MenuItem><MenuItem value="1700000">1700000</MenuItem><MenuItem value="1800000">1800000</MenuItem><MenuItem value="1900000">1900000</MenuItem><MenuItem value="2000000">2000000</MenuItem><MenuItem value="2100000">2100000</MenuItem><MenuItem value="2200000">2200000</MenuItem><MenuItem value="2300000">2300000</MenuItem><MenuItem value="2400000">2400000</MenuItem><MenuItem value="2500000">2500000</MenuItem><MenuItem value="2600000">2600000</MenuItem><MenuItem value="2700000">2700000</MenuItem><MenuItem value="2800000">2800000</MenuItem><MenuItem value="2900000">2900000</MenuItem><MenuItem value="3000000">3000000</MenuItem><MenuItem value="3100000">3100000</MenuItem><MenuItem value="3200000">3200000</MenuItem><MenuItem value="3300000">3300000</MenuItem><MenuItem value="3400000">3400000</MenuItem><MenuItem value="3500000">3500000</MenuItem><MenuItem value="3600000">3600000</MenuItem><MenuItem value="3700000">3700000</MenuItem><MenuItem value="3800000">3800000</MenuItem><MenuItem value="3900000">3900000</MenuItem><MenuItem value="4000000">4000000</MenuItem><MenuItem value="4100000">4100000</MenuItem><MenuItem value="4200000">4200000</MenuItem><MenuItem value="4300000">4300000</MenuItem><MenuItem value="4400000">4400000</MenuItem><MenuItem value="4500000">4500000</MenuItem><MenuItem value="4600000">4600000</MenuItem><MenuItem value="4700000">4700000</MenuItem><MenuItem value="4800000">4800000</MenuItem><MenuItem value="4900000">4900000</MenuItem><MenuItem value="5000000">5000000</MenuItem><MenuItem value="5100000">5100000</MenuItem><MenuItem value="5200000">5200000</MenuItem><MenuItem value="5300000">5300000</MenuItem><MenuItem value="5400000">5400000</MenuItem><MenuItem value="5500000">5500000</MenuItem>
                            </Select>
                            {"-"}
                            <Select
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                sx={{ mr: 1, minWidth: 100 }}
                            >
                                <MenuItem value="0">Max</MenuItem><MenuItem value="25000">25000</MenuItem><MenuItem value="50000">50000</MenuItem><MenuItem value="75000">75000</MenuItem><MenuItem value="100000">100000</MenuItem><MenuItem value="125000">125000</MenuItem><MenuItem value="150000">150000</MenuItem><MenuItem value="175000">175000</MenuItem><MenuItem value="200000">200000</MenuItem><MenuItem value="225000">225000</MenuItem><MenuItem value="250000">250000</MenuItem><MenuItem value="275000">275000</MenuItem><MenuItem value="300000">300000</MenuItem><MenuItem value="325000">325000</MenuItem><MenuItem value="350000">350000</MenuItem><MenuItem value="375000">375000</MenuItem><MenuItem value="400000">400000</MenuItem><MenuItem value="425000">425000</MenuItem><MenuItem value="450000">450000</MenuItem><MenuItem value="475000">475000</MenuItem><MenuItem value="500000">500000</MenuItem><MenuItem value="525000">525000</MenuItem><MenuItem value="550000">550000</MenuItem><MenuItem value="575000">575000</MenuItem><MenuItem value="600000">600000</MenuItem><MenuItem value="625000">625000</MenuItem><MenuItem value="650000">650000</MenuItem><MenuItem value="675000">675000</MenuItem><MenuItem value="700000">700000</MenuItem><MenuItem value="725000">725000</MenuItem><MenuItem value="750000">750000</MenuItem><MenuItem value="775000">775000</MenuItem><MenuItem value="800000">800000</MenuItem><MenuItem value="825000">825000</MenuItem><MenuItem value="850000">850000</MenuItem><MenuItem value="875000">875000</MenuItem><MenuItem value="900000">900000</MenuItem><MenuItem value="925000">925000</MenuItem><MenuItem value="950000">950000</MenuItem><MenuItem value="975000">975000</MenuItem><MenuItem value="1000000">1000000</MenuItem><MenuItem value="1100000">1100000</MenuItem><MenuItem value="1200000">1200000</MenuItem><MenuItem value="1300000">1300000</MenuItem><MenuItem value="1400000">1400000</MenuItem><MenuItem value="1500000">1500000</MenuItem><MenuItem value="1600000">1600000</MenuItem><MenuItem value="1700000">1700000</MenuItem><MenuItem value="1800000">1800000</MenuItem><MenuItem value="1900000">1900000</MenuItem><MenuItem value="2000000">2000000</MenuItem><MenuItem value="2100000">2100000</MenuItem><MenuItem value="2200000">2200000</MenuItem><MenuItem value="2300000">2300000</MenuItem><MenuItem value="2400000">2400000</MenuItem><MenuItem value="2500000">2500000</MenuItem><MenuItem value="2600000">2600000</MenuItem><MenuItem value="2700000">2700000</MenuItem><MenuItem value="2800000">2800000</MenuItem><MenuItem value="2900000">2900000</MenuItem><MenuItem value="3000000">3000000</MenuItem><MenuItem value="3100000">3100000</MenuItem><MenuItem value="3200000">3200000</MenuItem><MenuItem value="3300000">3300000</MenuItem><MenuItem value="3400000">3400000</MenuItem><MenuItem value="3500000">3500000</MenuItem><MenuItem value="3600000">3600000</MenuItem><MenuItem value="3700000">3700000</MenuItem><MenuItem value="3800000">3800000</MenuItem><MenuItem value="3900000">3900000</MenuItem><MenuItem value="4000000">4000000</MenuItem><MenuItem value="4100000">4100000</MenuItem><MenuItem value="4200000">4200000</MenuItem><MenuItem value="4300000">4300000</MenuItem><MenuItem value="4400000">4400000</MenuItem><MenuItem value="4500000">4500000</MenuItem><MenuItem value="4600000">4600000</MenuItem><MenuItem value="4700000">4700000</MenuItem><MenuItem value="4800000">4800000</MenuItem><MenuItem value="4900000">4900000</MenuItem><MenuItem value="5000000">5000000</MenuItem><MenuItem value="5100000">5100000</MenuItem><MenuItem value="5200000">5200000</MenuItem><MenuItem value="5300000">5300000</MenuItem><MenuItem value="5400000">5400000</MenuItem><MenuItem value="5500000">5500000</MenuItem>
                            </Select>
                            <Select
                                value={currency}
                                onChange={(e, newValue) => setCurrency(e.target.value)}
                                sx={{ mr: 1, minWidth: 100 }}
                            >
                                <MenuItem value="0">€(EUR)</MenuItem>
                                <MenuItem value="1">£(GBP)</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{ paddingLeft: 4, marginRight: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Beds
                            </Typography>
                            <Select
                                value={numBedrooms.min}
                                onChange={(e) => setNumBedrooms({ ...numBedrooms, min: e.target.value })}
                                sx={{ mr: 1, minWidth: 100 }}
                            >
                                <MenuItem value="0">Min</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="6">6</MenuItem>
                                <MenuItem value="7">7</MenuItem>
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="9">9</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                                <MenuItem value="13">13</MenuItem>
                                <MenuItem value="14">14</MenuItem>

                            </Select>
                            {"-"}
                            <Select
                                value={numBedrooms.max}
                                onChange={(e) => setNumBedrooms({ ...numBedrooms, max: e.target.value })}
                                sx={{ mr: 1, minWidth: 100 }}
                            >
                                <MenuItem value="0">Min</MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="4">4</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="6">6</MenuItem>
                                <MenuItem value="7">7</MenuItem>
                                <MenuItem value="8">8</MenuItem>
                                <MenuItem value="9">9</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                                <MenuItem value="11">11</MenuItem>
                                <MenuItem value="12">12</MenuItem>
                                <MenuItem value="13">13</MenuItem>
                                <MenuItem value="14">14</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                        <Box sx={{ marginRight: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                Add Keyword
                            </Typography>
                            <TextField
                                variant="outlined"
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </Box>
                    </Box>
                    <StyledButton variant="contained" onClick={handleSearch}>
                        Search Properties
                    </StyledButton>
                </Box>
            </StyledPaper >
            {displayedProperties.length > 0 &&
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: 2, mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, marginTop: 2, marginRight: 2 }}>
                            Sort By :
                        </Typography>
                        <Select
                            defaultValue={'address-asc'}
                            onChange={(e) => setSortOption(e.target.value)}
                            value={sortOption}
                        >
                            <MenuItem value={"address-asc"}>Address A-Z</MenuItem>
                            <MenuItem value={"address-desc"}>Address Z-A</MenuItem>
                            <MenuItem value={"price-asc"}>Price Low to High</MenuItem>
                            <MenuItem value={"price-desc"}>Price High to Low</MenuItem>
                        </Select>
                    </Box>
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Image</StyledTableCell>
                                    <StyledTableCell>Address</StyledTableCell>
                                    <StyledTableCell>Price</StyledTableCell>
                                    <StyledTableCell>View Details</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayedProperties.map((property, index) => (
                                    <StyledTableRow key={index}>

                                        <StyledTableCell>
                                            <img src={property.mainPhoto} alt="Property" width="300" height="300" style={{ borderRadius: '8px' }} />
                                        </StyledTableCell>
                                        <StyledTableCell>{property.address}</StyledTableCell>
                                        <StyledTableCell>{property.price}</StyledTableCell>
                                        <StyledTableCell>
                                            <StyledButton variant="contained" onClick={() => { if (typeof window !== 'undefined') { window.open(property.seoUrl, '_blank') } }}>
                                                View
                                            </StyledButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                    {/* Pagination Component */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={properties.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            }
        </Box >
    );
};

export default ListPage;