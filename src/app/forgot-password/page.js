// pages/forgot-password.js
"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import {
    Email,
    ArrowBack,
    CheckCircle
} from "@mui/icons-material";
import styles from "../styles/Auth.module.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        // Clear error when user starts typing
        if (errors.email) {
            setErrors({});
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            const data = await response.json();

            if (response.ok) {
                setEmailSent(true);
                setErrors({});
            } else {
                setErrors({ general: data.message || 'Failed to send reset email' });
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    const handleResendEmail = () => {
        setEmailSent(false);
        setEmail("");
        setErrors({});
    };

    if (emailSent) {
        return (
            <Container maxWidth="xl" className={styles.authContainer}>
                <Paper elevation={3} className={styles.authPaper}>
                    <Box className={styles.authHeader}>
                        <CheckCircle className={styles.successIcon} />
                        <Typography variant="h4" component="h1" className={styles.authTitle}>
                            Check Your Email
                        </Typography>
                        <Typography variant="body1" className={styles.authSubtitle}>
                            We've sent a password reset link to {email}
                        </Typography>
                    </Box>

                    <Box className={styles.emailSentContent}>
                        <Typography variant="body2" className={styles.instructionText}>
                            Click the link in your email to reset your password.
                            If you don't see the email, check your spam folder.
                        </Typography>

                        <Box className={styles.emailActions}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleBackToLogin}
                                className={styles.submitButton}
                            >
                                Back to Sign In
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleResendEmail}
                                className={styles.resendButton}
                            >
                                Didn't receive email? Try again
                            </Button>
                        </Box>

                        <Box className={styles.authFooter}>
                            <Typography variant="body2">
                                Remember your password?{' '}
                                <Link href="/login" className={styles.link}>
                                    Sign in here
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" className={styles.authContainer}>
            <Paper elevation={3} className={styles.authPaper}>
                <Box className={styles.authHeader}>
                    <Typography variant="h4" component="h1" className={styles.authTitle}>
                        Reset Password
                    </Typography>
                    <Typography variant="body1" className={styles.authSubtitle}>
                        Enter your email address and we'll send you a link to reset your password
                    </Typography>
                </Box>

                {errors.general && (
                    <Alert severity="error" className={styles.errorAlert}>
                        {errors.general}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className={styles.authForm}>
                    <TextField
                        fullWidth
                        name="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="Enter your email address"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>

                    <Box className={styles.backToLogin}>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={handleBackToLogin}
                            className={styles.backButton}
                        >
                            Back to Sign In
                        </Button>
                    </Box>

                    <Box className={styles.authFooter}>
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <Link href="/signup" className={styles.link}>
                                Sign up here
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}