"use client";
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Favorite as FavoriteIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { getFromLocalStorage } from '../utils/Common';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const LikedPropertiesPage = () => {
    const [likedProperties, setLikedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingProperty, setRemovingProperty] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, property: null });

    // Fetch liked properties on component mount
    useEffect(() => {
        fetchLikedProperties();
    }, []);

    const fetchLikedProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getFromLocalStorage('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/liked-properties`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch liked properties');
            }

            const data = await response.json();
            setLikedProperties(data.likedProperties || []);
        } catch (error) {
            console.error('Error fetching liked properties:', error);
            setError('Failed to load liked properties. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveProperty = async (property) => {
        setRemovingProperty(property.id);
        try {
            const token = getFromLocalStorage('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/unlike-property`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ propertyId: property.id }),
            });

            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (response.ok) {
                // Remove property from local state
                setLikedProperties(prev => prev.filter(p => p.id !== property.id));
                setConfirmDialog({ open: false, property: null });
            } else {
                throw new Error('Failed to remove property');
            }
        } catch (error) {
            console.error('Error removing property:', error);
            setError('Failed to remove property. Please try again.');
        } finally {
            setRemovingProperty(null);
        }
    };

    const openConfirmDialog = (property) => {
        setConfirmDialog({ open: true, property });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({ open: false, property: null });
    };

    const formatPrice = (price) => {
        if (!price) return 'Price not available';
        return price;
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress size={60} />
                    </Box>
                </Container>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FavoriteIcon color="error" />
                        My Liked Properties
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your favorite properties and keep track of the ones you're interested in.
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {likedProperties.length === 0 ? (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                            backgroundColor: '#f9f9f9',
                            borderRadius: 2,
                            border: '2px dashed #ddd'
                        }}
                    >
                        <FavoriteIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Liked Properties Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            Start exploring properties and click the heart icon to add them to your favorites.
                        </Typography>
                        <Button
                            variant="contained"
                            href="/map-search"
                            sx={{ mr: 2 }}
                        >
                            Search Properties
                        </Button>
                        <Button
                            variant="outlined"
                            href="/list-search"
                        >
                            Browse List
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ mb: 3 }}>
                            <Chip
                                label={`${likedProperties.length} ${likedProperties.length === 1 ? 'Property' : 'Properties'}`}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>

                        <Grid container spacing={3}>
                            {likedProperties.map((property) => (
                                <Grid item xs={12} sm={6} md={4} key={property.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            }
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={property.mainPhoto || '/placeholder-property.jpg'}
                                            alt={property.address}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" component="h2" gutterBottom noWrap>
                                                {property.address}
                                            </Typography>
                                            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                                                {formatPrice(property.price)}
                                            </Typography>
                                            {property.propertyType && (
                                                <Chip
                                                    label={property.propertyType}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ mb: 1 }}
                                                />
                                            )}
                                            {property.bedrooms && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                                                </Typography>
                                            )}
                                        </CardContent>
                                        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                            <Button
                                                size="small"
                                                startIcon={<ViewIcon />}
                                                onClick={() => {
                                                    if (typeof window !== 'undefined' && property.seoUrl) {
                                                        window.open(property.seoUrl, '_blank');
                                                    }
                                                }}
                                            >
                                                View Details
                                            </Button>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => openConfirmDialog(property)}
                                                disabled={removingProperty === property.id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                                    }
                                                }}
                                            >
                                                {removingProperty === property.id ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <DeleteIcon />
                                                )}
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {/* Confirmation Dialog */}
                <Dialog
                    open={confirmDialog.open}
                    onClose={closeConfirmDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        Remove from Liked Properties?
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to remove "{confirmDialog.property?.address}" from your liked properties?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeConfirmDialog}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleRemoveProperty(confirmDialog.property)}
                            color="error"
                            variant="contained"
                            disabled={removingProperty === confirmDialog.property?.id}
                        >
                            {removingProperty === confirmDialog.property?.id ? (
                                <CircularProgress size={20} />
                            ) : (
                                'Remove'
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <Footer />
        </>
    );
};

export default LikedPropertiesPage;
