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
    CircularProgress,
    Checkbox,
    FormControlLabel
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Google as GoogleIcon,
    Email,
    Lock,
    Person
} from "@mui/icons-material";
import styles from "../styles/Auth.module.css";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ukie/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Set token in cookies for SSR
                document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;

                router.push('/');
            } else {
                setErrors({ general: data.message || 'Registration failed' });
            }
        } catch (error) {
            console.error("Signup error:", error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setGoogleLoading(true);
        try {
            // Initialize Google OAuth2 flow
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/ukie/oauth2/authorize/google`;
        } catch (error) {
            console.error("Google signup error:", error);
            setErrors({ general: 'Google signup failed. Please try again.' });
            setGoogleLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" className={styles.authContainer}>
            <Paper elevation={3} className={styles.authPaper}>
                <Box className={styles.authHeader}>
                    <Typography variant="h4" component="h1" className={styles.authTitle}>
                        Create Account
                    </Typography>
                    <Typography variant="body1" className={styles.authSubtitle}>
                        Join UK Ireland Properties today
                    </Typography>
                </Box>

                {errors.general && (
                    <Alert severity="error" className={styles.errorAlert}>
                        {errors.general}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} className={styles.authForm}>
                    <Box className={styles.nameFields}>
                        <TextField
                            name="firstName"
                            label="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            error={!!errors.firstName}
                            helperText={errors.firstName}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                            className={styles.halfWidth}
                        />

                        <TextField
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            error={!!errors.lastName}
                            helperText={errors.lastName}
                            className={styles.halfWidth}
                        />
                    </Box>

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

                    <TextField
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        className={styles.textField}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="agreeToTerms"
                                checked={formData.agreeToTerms}
                                onChange={handleInputChange}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="body2">
                                I agree to the{' '}
                                <Link href="/terms" className={styles.link}>
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className={styles.link}>
                                    Privacy Policy
                                </Link>
                            </Typography>
                        }
                        className={styles.checkbox}
                    />
                    {errors.agreeToTerms && (
                        <Typography variant="body2" color="error" className={styles.checkboxError}>
                            {errors.agreeToTerms}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        className={styles.submitButton}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Create Account'}
                    </Button>

                    <Divider className={styles.divider}>
                        <Typography variant="body2">or</Typography>
                    </Divider>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
                        onClick={handleGoogleSignup}
                        disabled={googleLoading}
                        className={styles.googleButton}
                    >
                        {googleLoading ? 'Creating account...' : 'Continue with Google'}
                    </Button>

                    <Box className={styles.authFooter}>
                        <Typography variant="body2">
                            Already have an account?{' '}
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