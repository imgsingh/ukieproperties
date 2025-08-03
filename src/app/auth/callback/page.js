"use client";
import { useEffect, useState, Suspense } from 'react'; // Import Suspense
import { useRouter, useSearchParams } from 'next/navigation';
import { CircularProgress, Box, Typography, Alert } from '@mui/material';
import { setToLocalStorage } from './../../utils/Common'

// Create a separate component that uses useSearchParams
function AuthCallbackContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                setError('Authentication failed. Please try again.');
                setTimeout(() => router.push('/login?error=oauth_failed'), 3000);
                return;
            }

            if (token) {
                try {
                    setStatus('Validating token...');

                    // Validate token with backend
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/validate`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    const data = await response.json();

                    if (response.ok && data.success) {
                        setStatus('Setting up your session...');

                        // Store token and user data
                        setToLocalStorage('token', token);
                        setToLocalStorage('user', JSON.stringify(data.user));

                        // Set cookie for SSR (remove secure flag for localhost)
                        const isLocalhost = window.location.hostname === 'localhost';
                        document.cookie = `token=${token}; path=/; max-age=86400; ${!isLocalhost ? 'secure;' : ''} samesite=strict`;

                        setStatus('Redirecting to Home...');

                        // Redirect to dashboard
                        router.push('/');
                    } else {
                        throw new Error(data.message || 'Token validation failed');
                    }
                } catch (error) {
                    console.error('Callback error:', error);
                    setError(`Authentication failed: ${error.message}`);
                    setTimeout(() => router.push('/login?error=callback_failed'), 3000);
                }
            } else {
                setError('No authentication token received');
                setTimeout(() => router.push('/login?error=no_token'), 3000);
            }
        };
        handleCallback();
    }, [router, searchParams]); // Add searchParams to dependency array as it's a hook dependency

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            gap={2}
            sx={{ p: 3 }}
        >
            {error ? (
                <>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Typography variant="body1">
                        Redirecting to login page...
                    </Typography>
                </>
            ) : (
                <>
                    <CircularProgress size={60} />
                    <Typography variant="h6">
                        {status}
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default function PageWrapper() {
    return (
        <Suspense fallback={
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                gap={2}
                sx={{ p: 3 }}
            >
                <CircularProgress size={60} />
                <Typography variant="h6">Loading...</Typography>
            </Box>
        }>
            <AuthCallbackContent />
        </Suspense>
    );
}