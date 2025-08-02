"use client";

import React, { useState } from 'react';
import Navbar from './../component/Navbar';
import SearchBar from './../component/SearchBar';
import PropertyTable from './../component/PropertyTable'; // Import the common table component
import { Typography } from '@mui/material';
import styles from './page.module.css';
import Footer from "../component/Footer";
import { getFromLocalStorage } from '../utils/Common'

const Page = () => {
    const [searchResults, setSearchResults] = useState([]);

    const onSearch = async (query) => {
        try {
            const token = getFromLocalStorage('token');
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

            {/* Use the common PropertyTable component with AI chat enabled */}
            <PropertyTable properties={searchResults} showAiChat={true} />
            <div style={{ marginTop: '20px' }}>
                <Footer />
            </div>
        </div >
    );
};

export default Page;