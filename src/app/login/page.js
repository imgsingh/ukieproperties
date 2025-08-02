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
    Divider,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Google as GoogleIcon,
    Email,
    Lock
} from "@mui/icons-material";
import styles from "../styles/Auth.module.css";
import { setToLocalStorage } from "../utils/Common";

export default function Page() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/login`, {
                method: 'POST',
                //credentials: 'include', // Include cookies for SSR
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token and user info
                setToLocalStorage('token', data.token);
                setToLocalStorage('user', JSON.stringify(data.user));

                // Set token in cookies for SSR
                document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

                router.push('/');
            } else {
                setErrors({ general: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            // Initialize Google OAuth2 flow
            //window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorize/google?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}`;
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/ukie/oauth2/authorize/google`;
        } catch (error) {
            console.error("Google login error:", error);
            setErrors({ general: 'Google login failed. Please try again.' });
            setGoogleLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" className={styles.authContainer}>
            <Paper elevation={3} className={styles.authPaper}>
                <Box className={styles.authHeader}>
                    <Typography variant="h4" component="h1" className={styles.authTitle}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" className={styles.authSubtitle}>
                        Sign in to your UK Ireland Properties account
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
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email />
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <Box className={styles.forgotPassword}>
                        <Link href="/forgot-password" className={styles.link}>
                            Forgot your password?
                        </Link>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Sign In'}
                    </Button>

                    <Divider className={styles.divider}>
                        <Typography variant="body2">or</Typography>
                    </Divider>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className={styles.googleButton}
                    >
                        {googleLoading ? 'Signing in...' : 'Continue with Google'}
                    </Button>

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