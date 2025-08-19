"use client"
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Alert,
    InputAdornment,
    CircularProgress,
    IconButton
} from "@mui/material";
import {
    Lock,
    Visibility,
    VisibilityOff,
    ArrowBack,
    CheckCircle,
    Error
} from "@mui/icons-material";
import styles from "../styles/Auth.module.css";

// Create a wrapper component that handles the search params
function ResetPasswordContent() {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [token, setToken] = useState("");
    const [tokenValid, setTokenValid] = useState(true);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tokenFromUrl = searchParams.get('token');
        if (!tokenFromUrl) {
            setTokenValid(false);
        } else {
            setToken(tokenFromUrl);
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResetSuccess(true);
                setErrors({});
            } else {
                if (response.status === 400) {
                    setErrors({ general: 'Invalid or expired reset token. Please request a new password reset.' });
                } else {
                    setErrors({ general: data.message || 'Failed to reset password' });
                }
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push('/login');
    };

    const handleRequestNewReset = () => {
        router.push('/forgot-password');
    };

    // Invalid token page
    if (!tokenValid) {
        return (
            <Container maxWidth="xl" className={styles.authContainer}>
                <Paper elevation={3} className={styles.authPaper}>
                    <Box className={styles.authHeader}>
                        <Error className={styles.errorIcon} />
                        <Typography variant="h4" component="h1" className={styles.authTitle}>
                            Invalid Reset Link
                        </Typography>
                        <Typography variant="body1" className={styles.authSubtitle}>
                            This password reset link is invalid or has expired
                        </Typography>
                    </Box>

                    <Box className={styles.emailSentContent}>
                        <Typography variant="body2" className={styles.instructionText}>
                            Password reset links are only valid for 24 hours and can only be used once.
                        </Typography>

                        <Box className={styles.emailActions}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleRequestNewReset}
                                className={styles.submitButton}
                            >
                                Request New Reset Link
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleBackToLogin}
                                className={styles.backButton}
                            >
                                Back to Sign In
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // Success page
    if (resetSuccess) {
        return (
            <Container maxWidth="xl" className={styles.authContainer}>
                <Paper elevation={3} className={styles.authPaper}>
                    <Box className={styles.authHeader}>
                        <CheckCircle className={styles.successIcon} />
                        <Typography variant="h4" component="h1" className={styles.authTitle}>
                            Password Reset Successful
                        </Typography>
                        <Typography variant="body1" className={styles.authSubtitle}>
                            Your password has been successfully updated
                        </Typography>
                    </Box>

                    <Box className={styles.emailSentContent}>
                        <Typography variant="body2" className={styles.instructionText}>
                            You can now sign in with your new password.
                        </Typography>

                        <Box className={styles.emailActions}>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleBackToLogin}
                                className={styles.submitButton}
                            >
                                Sign In Now
                            </Button>
                        </Box>

                        <Box className={styles.authFooter}>
                            <Typography variant="body2">
                                Need help?{' '}
                                <Link href="/contact" className={styles.link}>
                                    Contact support
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // Reset password form
    return (
        <Container maxWidth="xl" className={styles.authContainer}>
            <Paper elevation={3} className={styles.authPaper}>
                <Box className={styles.authHeader}>
                    <Typography variant="h4" component="h1" className={styles.authTitle}>
                        Create New Password
                    </Typography>
                    <Typography variant="body1" className={styles.authSubtitle}>
                        Enter your new password below
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
                        name="newPassword"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        placeholder="Enter your new password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => togglePasswordVisibility('password')}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <TextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        placeholder="Confirm your new password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <Box className={styles.passwordRequirements}>
                        <Typography variant="caption" color="textSecondary">
                            Password must be at least 8 characters long and contain:
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            • At least one uppercase letter (A-Z)
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            • At least one lowercase letter (a-z)
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            • At least one number (0-9)
                        </Typography>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
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
                            Didn't request this reset?{' '}
                            <Link href="/contact" className={styles.link}>
                                Contact support
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
    return (
        <Container maxWidth="xl" className={styles.authContainer}>
            <Paper elevation={3} className={styles.authPaper}>
                <Box className={styles.authHeader}>
                    <Typography variant="h4" component="h1" className={styles.authTitle}>
                        Loading...
                    </Typography>
                </Box>
                <Box className={styles.authForm} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            </Paper>
        </Container>
    );
}

// Main export with Suspense boundary
export default function ResetPassword() {
    return (
        <Suspense fallback={<ResetPasswordLoading />}>
            <ResetPasswordContent />
        </Suspense>
    );
}