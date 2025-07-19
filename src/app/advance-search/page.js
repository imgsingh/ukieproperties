"use client";

import React, { useState } from 'react';
import Navbar from './../component/Navbar';
import SearchBar from './../component/SearchBar';
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
    ListItemText,
    CircularProgress,
    Divider,
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import styles from './page.module.css';

const Page = () => {
    const [searchResults, setSearchResults] = useState([]);
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

    const onSearch = async (query) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/aiSearchProperties`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                window.location.href = '/login';
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSearchResults(data || []);
        } catch (error) {
            console.error('Error during search:', error);
        }
    };

    // Fetch property description
    const fetchPropertyDescription = async (property) => {
        setIsLoadingDescription(true);
        try {
            const token = localStorage.getItem('token');
            // Replace with your actual API endpoint to fetch property description
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
            // Replace with your actual AI endpoint
            const token = localStorage.getItem('token');
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className={styles.container}>
            <Navbar />
            <Typography
                variant="h4"
                sx={{
                    textAlign: 'center',
                    marginTop: '20px',
                    marginBottom: '20px',
                    color: '#1976d2',
                    fontWeight: 'bold',
                }}
            >
                AI-Based Search
            </Typography>
            <SearchBar onSearch={onSearch} />
            {searchResults.length > 0 && (
                <Box sx={{ marginTop: 4 }}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {searchResults
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <img
                                                    src={item.mainPhoto}
                                                    alt="Property"
                                                    width="300"
                                                    height="300"
                                                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                                                />
                                            </TableCell>
                                            <TableCell>{item.address}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={<BotIcon />}
                                                        onClick={() => handleAiChatClick(item)}
                                                        sx={{
                                                            minWidth: 'fit-content',
                                                            backgroundColor: '#f0f8ff',
                                                            '&:hover': {
                                                                backgroundColor: '#e1f0ff',
                                                            }
                                                        }}
                                                    >
                                                        Talk with AI
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => { if (typeof window !== 'undefined') { window.open(item.seoUrl, '_blank') } }}
                                                    >
                                                        View Details
                                                    </Button>
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
                        count={searchResults.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            )}

            {/* AI Chat Dialog */}
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
                            {currentProperty.price}
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
        </div>
    );
};

export default Page;