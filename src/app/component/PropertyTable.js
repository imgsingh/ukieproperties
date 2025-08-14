import React, { useState, useEffect } from 'react';
import {
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Paper,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    List,
    ListItem,
    CircularProgress,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
    CurrencyExchange as CurrencyIcon,
    Refresh as RefreshIcon,
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { getFromLocalStorage } from '../utils/Common';

const PropertyTable = ({ properties = [], showAiChat = false }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // AI Chat states
    const [aiChatOpen, setAiChatOpen] = useState(false);
    const [currentProperty, setCurrentProperty] = useState(null);
    const [propertyDescription, setPropertyDescription] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [isLoadingDescription, setIsLoadingDescription] = useState(false);
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);

    // Currency converter states
    const [exchangeRates, setExchangeRates] = useState({ EUR_GBP: 1, GBP_EUR: 1 });
    const [displayCurrency, setDisplayCurrency] = useState('GBP'); // GBP or EUR
    const [loadingRates, setLoadingRates] = useState(false);
    const [ratesLastUpdated, setRatesLastUpdated] = useState(null);

    // Liked properties state
    const [likedProperties, setLikedProperties] = useState(new Set());
    const [likingInProgress, setLikingInProgress] = useState(new Set());

    // Fetch exchange rates
    const fetchExchangeRates = async () => {
        setLoadingRates(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/exchange-rates`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setExchangeRates(data);
            setRatesLastUpdated(new Date());
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
            // Keep default rates if fetch fails
        } finally {
            setLoadingRates(false);
        }
    };

    // Load exchange rates and liked properties on component mount
    useEffect(() => {
        fetchExchangeRates();
        fetchLikedProperties();
    }, []);

    // Fetch user's liked properties
    const fetchLikedProperties = async () => {
        try {
            const token = getFromLocalStorage('token');
            if (!token) return;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/liked-properties`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                const likedIds = new Set(data.likedProperties?.map(p => p.id) || []);
                setLikedProperties(likedIds);
            }
        } catch (error) {
            console.error('Error fetching liked properties:', error);
        }
    };

    // Handle like/unlike property
    const handleLikeProperty = async (property) => {
        const propertyId = property.id;
        const isCurrentlyLiked = likedProperties.has(propertyId);

        // Add to loading state
        setLikingInProgress(prev => new Set([...prev, propertyId]));

        try {
            const token = getFromLocalStorage('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const endpoint = isCurrentlyLiked ? 'unlike-property' : 'like-property';
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/${endpoint}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ propertyId, propertyData: property }),
            });

            if (response.ok) {
                // Update local state
                setLikedProperties(prev => {
                    const newSet = new Set(prev);
                    if (isCurrentlyLiked) {
                        newSet.delete(propertyId);
                    } else {
                        newSet.add(propertyId);
                    }
                    return newSet;
                });
            } else if (response.status === 401) {
                window.location.href = '/login';
            } else {
                console.error('Failed to update like status');
            }
        } catch (error) {
            console.error('Error updating like status:', error);
        } finally {
            // Remove from loading state
            setLikingInProgress(prev => {
                const newSet = new Set(prev);
                newSet.delete(propertyId);
                return newSet;
            });
        }
    };

    // Convert price based on selected currency
    const convertPrice = (priceString) => {
        if (!priceString || !exchangeRates) return priceString;

        // Extract numeric value from price string (assuming format like "£500,000" or "€600,000")
        const numericValue = parseFloat(priceString.replace(/[£€,]/g, ''));

        if (isNaN(numericValue)) return priceString;

        // Determine original currency from the price string
        const isOriginallyGBP = priceString.includes('£');
        const isOriginallyEUR = priceString.includes('€');

        let convertedValue = numericValue;
        let symbol = '£';

        if (displayCurrency === 'EUR') {
            symbol = '€';
            if (isOriginallyGBP) {
                // Convert GBP to EUR
                convertedValue = numericValue * exchangeRates.EUR_GBP;
            }
            // If originally EUR, keep as is
        } else {
            symbol = '£';
            if (isOriginallyEUR) {
                // Convert EUR to GBP
                convertedValue = numericValue * exchangeRates.GBP_EUR;
            }
            // If originally GBP, keep as is
        }

        // Format the converted value
        return `${symbol}${convertedValue.toLocaleString('en-GB', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        })}`;
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle currency change
    const handleCurrencyChange = (event) => {
        setDisplayCurrency(event.target.value);
    };

    // Fetch property description
    const fetchPropertyDescription = async (property) => {
        setIsLoadingDescription(true);
        try {
            const token = getFromLocalStorage('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/propertyDescription/${property.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                window.location.href = '/login';
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.description || 'Property description not available.';
        } catch (error) {
            console.error('Error fetching property description:', error);
            return 'Unable to fetch property description at the moment.';
        } finally {
            setIsLoadingDescription(false);
        }
    };

    // Handle AI chat button click
    const handleAiChatClick = async (property) => {
        setCurrentProperty(property);
        setAiChatOpen(true);
        setChatMessages([
            {
                type: 'bot',
                message: 'Hello! I\'m here to help you with information about this property. Let me fetch the details first...',
                timestamp: new Date(),
            }
        ]);

        const description = await fetchPropertyDescription(property);
        setPropertyDescription(description);

        setChatMessages(prev => [
            ...prev,
            {
                type: 'bot',
                message: `I've loaded the property information. Here's what I know about this property:\n\n${description}\n\nFeel free to ask me any questions about this property!`,
                timestamp: new Date(),
            }
        ]);
    };

    // Send message to AI
    const sendMessageToAI = async (message, propertyContext) => {
        try {
            const token = getFromLocalStorage('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/aiPropertyChat`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: message,
                    propertyContext: propertyContext,
                    propertyDetails: currentProperty,
                }),
            });

            if (!response.ok) {
                window.location.href = '/login';
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const data1 = JSON.parse(data.response);
            const res = data1?.candidates[0]?.content?.parts[0]?.text
            return res || 'I apologize, but I couldn\'t process your request at the moment.';
        } catch (error) {
            console.error('Error sending message to AI:', error);
            return 'I\'m sorry, there was an error processing your message. Please try again.';
        }
    };

    // Handle sending user message
    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const newUserMessage = {
            type: 'user',
            message: userMessage,
            timestamp: new Date(),
        };

        setChatMessages(prev => [...prev, newUserMessage]);
        setUserMessage('');
        setIsLoadingResponse(true);

        try {
            const aiResponse = await sendMessageToAI(userMessage, propertyDescription);

            const newBotMessage = {
                type: 'bot',
                message: aiResponse,
                timestamp: new Date(),
            };

            setChatMessages(prev => [...prev, newBotMessage]);
        } catch (error) {
            const errorMessage = {
                type: 'bot',
                message: 'I apologize, but I encountered an error. Please try asking your question again.',
                timestamp: new Date(),
            };
            setChatMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoadingResponse(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    // Close AI chat dialog
    const handleCloseAiChat = () => {
        setAiChatOpen(false);
        setCurrentProperty(null);
        setPropertyDescription('');
        setChatMessages([]);
        setUserMessage('');
    };

    if (!properties || properties.length === 0) {
        return null;
    }

    return (
        <Box sx={{ marginTop: 4 }}>
            {/* Currency Converter Controls */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Display Currency</InputLabel>
                        <Select
                            value={displayCurrency}
                            label="Display Currency"
                            onChange={handleCurrencyChange}
                            startAdornment={<CurrencyIcon sx={{ mr: 1, color: 'action.active' }} />}
                        >
                            <MenuItem value="GBP">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>£ GBP</span>
                                </Box>
                            </MenuItem>
                            <MenuItem value="EUR">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <span>€ EUR</span>
                                </Box>
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Tooltip title="Refresh exchange rates">
                        <IconButton
                            onClick={fetchExchangeRates}
                            disabled={loadingRates}
                            size="small"
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>

                    {loadingRates && <CircularProgress size={20} />}
                </Box>

                {/* Exchange Rate Info */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Chip
                        label={`1 GBP = ${exchangeRates.EUR_GBP?.toFixed(4)} EUR`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={`1 EUR = ${exchangeRates.GBP_EUR?.toFixed(4)} GBP`}
                        size="small"
                        variant="outlined"
                    />
                    {ratesLastUpdated && (
                        <Typography variant="caption" color="text.secondary">
                            Updated: {ratesLastUpdated.toLocaleTimeString()}
                        </Typography>
                    )}
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: '300px' }}>Image</TableCell>
                            <TableCell sx={{ width: '300px', minWidth: '250px' }}>Address</TableCell>
                            <TableCell sx={{ width: '150px' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Price
                                    <CurrencyIcon fontSize="small" color="action" />
                                </Box>
                            </TableCell>
                            <TableCell sx={{ width: '200px', minWidth: '180px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((property, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ padding: 1 }}>
                                        <img
                                            src={property.mainPhoto}
                                            alt="Property"
                                            style={{
                                                width: '300px',
                                                height: '200px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                display: 'block'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{
                                        maxWidth: '300px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        padding: '8px 16px'
                                    }}>
                                        <Tooltip title={property.address} placement="top">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'help'
                                                }}
                                            >
                                                {property.address}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px 16px' }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">
                                                {convertPrice(property.price)}
                                            </Typography>
                                            {/* Show original price if converted */}
                                            {((property.price.includes('£') && displayCurrency === 'EUR') ||
                                                (property.price.includes('€') && displayCurrency === 'GBP')) && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        Original: {property.price}
                                                    </Typography>
                                                )}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ padding: '8px 16px' }}>
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1.5,
                                            alignItems: 'stretch',
                                            minWidth: '160px'
                                        }}>
                                            {/* First row: Like button and View Details */}
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Tooltip title={likedProperties.has(property.id) ? "Remove from favorites" : "Add to favorites"}>
                                                    <IconButton
                                                        onClick={() => handleLikeProperty(property)}
                                                        disabled={likingInProgress.has(property.id)}
                                                        sx={{
                                                            color: likedProperties.has(property.id) ? '#e91e63' : '#757575',
                                                            '&:hover': {
                                                                color: '#e91e63',
                                                                backgroundColor: 'rgba(233, 30, 99, 0.04)'
                                                            },
                                                            minWidth: 'auto',
                                                            padding: '6px'
                                                        }}
                                                    >
                                                        {likingInProgress.has(property.id) ? (
                                                            <CircularProgress size={20} />
                                                        ) : likedProperties.has(property.id) ? (
                                                            <FavoriteIcon fontSize="small" />
                                                        ) : (
                                                            <FavoriteBorderIcon fontSize="small" />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<VisibilityIcon fontSize="small" />}
                                                    onClick={() => { if (typeof window !== 'undefined') { window.open(property.seoUrl, '_blank') } }}
                                                    sx={{
                                                        flex: 1,
                                                        minWidth: 'fit-content',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'none',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    View Details
                                                </Button>
                                            </Box>

                                            {/* Second row: AI Chat button */}
                                            {showAiChat && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<BotIcon fontSize="small" />}
                                                    onClick={() => handleAiChatClick(property)}
                                                    size="small"
                                                    sx={{
                                                        width: '100%',
                                                        backgroundColor: '#f0f8ff',
                                                        borderColor: '#1976d2',
                                                        color: '#1976d2',
                                                        fontSize: '0.75rem',
                                                        textTransform: 'none',
                                                        fontWeight: 500,
                                                        '&:hover': {
                                                            backgroundColor: '#e3f2fd',
                                                            borderColor: '#1976d2',
                                                        }
                                                    }}
                                                >
                                                    Talk with AI
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={properties.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* AI Chat Dialog */}
            {showAiChat && (
                <Dialog
                    open={aiChatOpen}
                    onClose={handleCloseAiChat}
                    maxWidth="md"
                    fullWidth
                    PaperProps={{
                        sx: { height: '80vh', display: 'flex', flexDirection: 'column' }
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BotIcon color="primary" />
                            <Typography variant="h6">
                                AI Property Assistant
                            </Typography>
                        </Box>
                        <IconButton onClick={handleCloseAiChat}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <Divider />

                    {currentProperty && (
                        <Box sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Discussing Property:
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {currentProperty.address}
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {convertPrice(currentProperty.price)}
                                {/* Show both currencies in chat header */}
                                {((currentProperty.price.includes('£') && displayCurrency === 'EUR') ||
                                    (currentProperty.price.includes('€') && displayCurrency === 'GBP')) && (
                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            ({currentProperty.price})
                                        </Typography>
                                    )}
                            </Typography>
                        </Box>
                    )}

                    <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
                        <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                            {chatMessages.map((msg, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                        alignItems: 'flex-start',
                                        mb: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            maxWidth: '70%',
                                            backgroundColor: msg.type === 'user' ? '#1976d2' : '#f5f5f5',
                                            color: msg.type === 'user' ? 'white' : 'black',
                                            borderRadius: 2,
                                            p: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                                        >
                                            {msg.message}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: 'block',
                                                mt: 0.5,
                                                opacity: 0.7,
                                                fontSize: '0.7rem',
                                            }}
                                        >
                                            {msg.timestamp.toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}

                            {(isLoadingDescription || isLoadingResponse) && (
                                <ListItem sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 2,
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <CircularProgress size={16} />
                                        <Typography variant="body2">
                                            {isLoadingDescription ? 'Loading property details...' : 'AI is thinking...'}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            )}
                        </List>
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ p: 2, display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            multiline
                            maxRows={4}
                            placeholder="Ask me anything about this property..."
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoadingDescription || isLoadingResponse}
                            variant="outlined"
                            size="small"
                        />
                        <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={handleSendMessage}
                            disabled={!userMessage.trim() || isLoadingDescription || isLoadingResponse}
                            sx={{ minWidth: 'fit-content' }}
                        >
                            Send
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Box>
    );
};

export default PropertyTable;