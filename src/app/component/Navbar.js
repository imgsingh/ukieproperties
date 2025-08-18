"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Navbar.module.css";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Button,
    Avatar,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";
import { getFromLocalStorage } from "../utils/Common";

export default function Navbar() {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if the user is logged in
        const token = getFromLocalStorage('token');
        const userData = getFromLocalStorage('user');
        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchorEl(null);
    };

    const handleLogout = () => {
        // Clear user data and token
        if (typeof window != "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        setIsLoggedIn(false);
        setUser(null);
        router.push('/');
        handleUserMenuClose();
    };

    const handleProfile = () => {
        router.push('/profile');
        handleUserMenuClose();
    };

    const handleLikedProperties = () => {
        router.push('/liked-properties');
        handleUserMenuClose();
    };

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    // Base navigation items
    const baseNavItems = [
        {
            type: "link",
            href: "/",
            label: "Home"
        },
        {
            type: "link",
            href: "/about",
            label: "About Us"
        }
    ];

    const searchItems = [
        { href: "/map-search", label: "Map Search" },
        { href: "/list-search", label: "List Search" },
        { href: "/advance-search", label: "Advanced Search" },
    ];

    // Build navigation array based on login status
    const buildNavItems = () => {
        const navItems = [...baseNavItems];

        // Add search properties dropdown if logged in
        if (isLoggedIn) {
            navItems.push({
                type: "link",
                href: "/dashboard",
                label: "Dashboard"
            })

            navItems.push({
                type: "dropdown",
                label: "Search Properties",
                items: searchItems,
                onClick: handleMenuOpen,
                anchorEl: anchorEl,
                onClose: handleMenuClose,
            });
        }

        // Add auth items
        if (isLoggedIn) {
            navItems.push({
                type: "userAvatar",
                user: user,
                onClick: handleUserMenuOpen,
                anchorEl: userMenuAnchorEl,
                onClose: handleUserMenuClose,
                onLogout: handleLogout,
                onProfile: handleProfile,
                onLikedProperties: handleLikedProperties,
            });
        } else {
            navItems.push({
                type: "authButtons",
                buttons: [
                    {
                        type: "text",
                        href: "/login",
                        label: "Log in",
                    },
                    {
                        type: "contained",
                        href: "/signup",
                        label: "Sign Up",
                    },
                ],
            });
        }

        return navItems;
    };

    const navItems = buildNavItems();

    // Render navigation item based on type
    const renderNavItem = (item, index) => {
        switch (item.type) {
            case "link":
                return (
                    <li key={item.href} className={styles.navItem}>
                        <Link href={item.href} className={styles.navLink}>
                            {item.label}
                        </Link>
                    </li>
                );

            case "dropdown":
                return (
                    <li key="search-dropdown" className={styles.navItem}>
                        <Button
                            color="inherit"
                            onClick={item.onClick}
                            endIcon={<ExpandMoreIcon />}
                            sx={{
                                color: "white",
                                textTransform: "none",
                                fontSize: "inherit",
                                fontWeight: "inherit",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            {item.label}
                        </Button>
                        <Menu
                            anchorEl={item.anchorEl}
                            open={Boolean(item.anchorEl)}
                            onClose={item.onClose}
                            MenuListProps={{
                                "aria-labelledby": "search-button",
                            }}
                        >
                            {item.items.map((searchItem) => (
                                <MenuItem
                                    key={searchItem.href}
                                    onClick={item.onClose}
                                    component="a"
                                    href={searchItem.href}
                                >
                                    {searchItem.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </li>
                );

            case "userAvatar":
                return (
                    <li key="user-avatar" className={styles.navItem}>
                        <IconButton onClick={item.onClick}>
                            <Avatar alt={item.user?.firstName || "User"} src={item.user?.avatar || ""} />
                        </IconButton>
                        <Menu
                            anchorEl={item.anchorEl}
                            open={Boolean(item.anchorEl)}
                            onClose={item.onClose}
                        >
                            <MenuItem onClick={item.onLikedProperties}>Liked Properties</MenuItem>
                            <MenuItem onClick={item.onProfile}>Profile</MenuItem>
                            <MenuItem onClick={item.onLogout}>Logout</MenuItem>
                        </Menu>
                    </li>
                );

            case "authButtons":
                return (
                    <li key="auth-buttons" className={styles.navItem}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            {item.buttons.map((button, btnIndex) => (
                                <Button
                                    key={button.href}
                                    variant={button.type}
                                    component={Link}
                                    href={button.href}
                                    sx={{
                                        color: "white",
                                        textTransform: "none",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        ...(button.type === "contained"
                                            ? {
                                                backgroundColor: "#00d4aa",
                                                borderRadius: "4px",
                                                "&:hover": {
                                                    backgroundColor: "#00b894",
                                                },
                                            }
                                            : {
                                                "&:hover": {
                                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                },
                                            }),
                                    }}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Box>
                    </li>
                );

            default:
                return null;
        }
    };

    // Build mobile drawer items
    const buildMobileDrawerItems = () => {
        const mobileItems = [...baseNavItems];

        // Add auth items for mobile
        if (isLoggedIn) {

            mobileItems.push({
                type: "link",
                href: "/dashboard",
                label: "Dashboard"
            });

            // Add search items for mobile
            mobileItems.push(...searchItems.map(item => ({
                type: "link",
                href: item.href,
                label: item.label,
            })));

            mobileItems.push({
                type: "link",
                href: "/liked-properties",
                label: "Liked Properties"
            });

            mobileItems.push({
                type: "button",
                label: "Logout",
                onClick: handleLogout,
            });
        } else {
            mobileItems.push(
                {
                    type: "link",
                    href: "/login",
                    label: "Log in",
                },
                {
                    type: "link",
                    href: "/signup",
                    label: "Sign Up",
                    highlighted: true,
                }
            );
        }

        return mobileItems;
    };

    const mobileDrawerItems = buildMobileDrawerItems();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo Section */}
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.horizontallogo}>
                        <div className={styles.logoicon}>
                            <Image
                                src="/logo.png"
                                alt="HomeAssist Logo"
                                width={40}
                                height={40}
                                className={styles.logoImage}
                            />
                        </div>
                        <div className={styles.logotext}>
                            <h1 className={styles.companyname}>
                                <span className={styles.ukpart}>Home</span>
                                <span className={styles.irelandpart}>Assist</span>
                            </h1>
                            <p className={styles.tagline}>Your Bridge to Property Success</p>
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                    }}
                >
                    <ul className={styles.navList}>
                        {navItems.map((item, index) => renderNavItem(item, index))}
                    </ul>
                </Box>

                {/* Mobile Hamburger Menu */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="open navigation menu"
                    onClick={toggleDrawer(true)}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        color: "white",
                        ml: "auto",
                    }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="left"
                    open={isDrawerOpen}
                    onClose={toggleDrawer(false)}
                    PaperProps={{
                        sx: {
                            width: 250,
                            bgcolor: "background.paper",
                        },
                    }}
                >
                    <Box sx={{ pt: 2 }}>
                        <List>
                            {mobileDrawerItems.map((item, index) => (
                                <ListItem
                                    key={item.href || item.label}
                                    button
                                    component={item.type === "button" ? "div" : "a"}
                                    href={item.href}
                                    onClick={item.onClick || toggleDrawer(false)}
                                    sx={
                                        item.highlighted
                                            ? {
                                                "& .MuiListItemText-primary": {
                                                    color: "#00d4aa",
                                                    fontWeight: 500,
                                                },
                                            }
                                            : {}
                                    }
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            </div>
        </nav>
    );
}