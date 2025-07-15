import React, { useState, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from '@mui/material';

function PropertiesDialog({ openPopup, handleClosePopup, properties }) {
    const [order, setOrder] = useState('asc'); // Sorting order (ascending or descending)
    const [orderBy, setOrderBy] = useState('address'); // Column to sort by

    // Handle sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Comparator function for sorting
    const comparator = (a, b) => {
        if (orderBy === 'address') {
            return order === 'asc'
                ? a.address.localeCompare(b.address)
                : b.address.localeCompare(a.address);
        }
        if (orderBy === 'price') {
            const parsePrice = (price) => {
                // If the price contains "k", multiply by 1000
                if (price.toLowerCase().includes('k')) {
                    return parseFloat(price.replace(/[^0-9.-]+/g, '').replace('k', '')) * 1000;
                }
                // Else just remove any non-numeric characters and parse as float
                return parseFloat(price.replace(/[^0-9.-]+/g, ''));
            };

            // Convert both prices
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);

            // Compare prices
            return order === 'asc' ? priceA - priceB : priceB - priceA;
        }
        return 0;
    };

    // Memoize the sorted properties to optimize performance
    const sortedProperties = useMemo(() => {
        return [...properties].sort(comparator);
    }, [properties, order, orderBy]);

    return (
        <Dialog open={openPopup} onClose={handleClosePopup}>
            <DialogTitle>Properties List</DialogTitle>
            <DialogContent>
                <TableContainer component={Paper}>
                    <Table aria-label="properties table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'address'}
                                        direction={orderBy === 'address' ? order : 'asc'}
                                        onClick={() => handleRequestSort('address')}
                                    >
                                        Property Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'price'}
                                        direction={orderBy === 'price' ? order : 'asc'}
                                        onClick={() => handleRequestSort('price')}
                                    >
                                        Property Price
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Property URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedProperties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>{property.address}</TableCell>
                                    <TableCell>{property.price}</TableCell>
                                    <TableCell>
                                        <a href={property.seoUrl} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClosePopup} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PropertiesDialog;
