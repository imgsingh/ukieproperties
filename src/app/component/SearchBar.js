"use client";
import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Set isMounted to true after the component mounts
    }, []);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleSearch(); // Trigger search on pressing Enter
        }
    };

    if (!isMounted) return null;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20vh",
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                sx={{
                    width: "50%",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "24px", // Rounded corners like Google
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton onClick={handleSearch}>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    );
};

export default SearchBar;