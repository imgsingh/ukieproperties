"use client";

import React, { useState } from 'react';
import Navbar from './../component/Navbar';
import SearchBar from './../component/SearchBar';
import PropertyTable from './../component/PropertyTable';
import QueryDisplay from './../component/QueryDisplay'; // Import the new component
import { Typography } from '@mui/material';
import styles from './page.module.css';
import Footer from "../component/Footer";
import { getFromLocalStorage } from '../utils/Common';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const Page = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [queryInfo, setQueryInfo] = useState({
        originalQuery: '',
        executedQuery: '',
        resultCount: 0
    });

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

            // Handle the new response structure
            const properties = data.properties || data || [];
            const executedQuery = data.executedQuery || '';
            const originalQuery = data.originalQuery || query;

            setSearchResults(properties);
            setQueryInfo({
                originalQuery,
                executedQuery,
                resultCount: properties.length
            });

            if (!properties || properties.length === 0) {
                toastr.info('No properties found for this search!');
            } else {
                toastr.success(`Found ${properties.length} properties!`);
            }
        } catch (error) {
            console.error('Error during search:', error);
            setQueryInfo({
                originalQuery: query,
                executedQuery: 'Error executing query',
                resultCount: 0
            });
            toastr.error('Error occurred during search');
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

            {/* Display query information */}
            <QueryDisplay
                originalQuery={queryInfo.originalQuery}
                executedQuery={queryInfo.executedQuery}
                resultCount={queryInfo.resultCount}
            />

            {/* Use the common PropertyTable component with AI chat enabled */}
            <PropertyTable properties={searchResults} showAiChat={true} />
            <div style={{ marginTop: '20px' }}>
                <Footer />
            </div>
        </div>
    );
};

export default Page;