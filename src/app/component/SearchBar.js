"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    Button,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Chip
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';
import { debounce } from 'lodash';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const inputRef = useRef(null);

    // Debounced function to get suggestions
    const getSuggestions = useRef(
        debounce(async (searchQuery) => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/getSuggestions`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ query: searchQuery }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data.suggestions || []);
                    setShowSuggestions(true);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        }, 300)
    ).current;

    useEffect(() => {
        getSuggestions(query);
    }, [query, getSuggestions]);

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length === 0) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        // onSearch(suggestion);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            onSearch(query);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    // Popular searches (you can make this dynamic)
    const popularSearches = [
        "2 bedroom apartment Dublin",
        "House for rent Cork",
        "Studio apartment Galway",
        "3 bedroom house Dublin under €2000",
        "Apartment near Trinity College"
    ];

    return (
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, margin: '0 auto' }}>
            <form onSubmit={handleSearch}>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                        ref={inputRef}
                        fullWidth
                        variant="outlined"
                        placeholder="Try: '2 bedroom apartment in Dublin under €1500' or 'house near DART station'"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                        InputProps={{
                            startAdornment: <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />,
                            endAdornment: isLoadingSuggestions && <CircularProgress size={20} />
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 10,
                                '&:hover': {
                                    '& > fieldset': {
                                        borderColor: 'primary.main',
                                    }
                                }
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ borderRadius: 10, minWidth: 100 }}
                        startIcon={<Search />}
                    >
                        Search
                    </Button>
                </Box>
            </form>

            {/* Popular Searches */}
            {!query && (
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {popularSearches.map((search, index) => (
                            <Chip
                                key={index}
                                label={search}
                                onClick={() => handleSuggestionClick(search)}
                                variant="outlined"
                                size="small"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Auto-Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <Paper
                    ref={suggestionsRef}
                    elevation={4}
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: 300,
                        overflow: 'auto',
                        mt: 1,
                        borderRadius: 2
                    }}
                >
                    <List dense>
                        {suggestions.map((suggestion, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                sx={{
                                    '&:hover': { backgroundColor: 'action.hover' },
                                    cursor: 'pointer'
                                }}
                            >
                                <AutoAwesome sx={{ mr: 1, color: 'primary.main', fontSize: 16 }} />
                                <ListItemText
                                    primary={suggestion}
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;