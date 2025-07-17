"use client"
import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import image from '../assets/images/house-icon.png'
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/system";
import { SearchIcon } from "lucide-react";

export default function Navbar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };

    // Navigation items for reusability
    const navItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About Us" }
    ];

    const searchItems = [
        { href: "/map-search", label: "Map Search" },
        { href: "/list-search", label: "List Search" },
        { href: "/advance-search", label: "Advanced Search" }
    ];

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Logo Section */}
                <Link href="/" className={styles.logoLink}>
                    <div className={styles.horizontallogo}>
                        <div className={styles.logoicon}>
                            {/* Uncomment and style these as needed */}
                            {/* <div className={styles.flaguk}></div>
                            <div className={styles.flagireland}></div>
                            <div className={styles.houseicon}></div> */}
                        </div>
                        <div className={styles.logotext}>
                            <h1 className={styles.companyname}>
                                <span className={styles.ukpart}>UK</span>
                                <span className={styles.irelandpart}>Ireland</span> Properties
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
                        gap: 2
                    }}
                >
                    <ul className={styles.navList}>
                        {navItems.map((item) => (
                            <li key={item.href} className={styles.navItem}>
                                <Link href={item.href} className={styles.navLink}>
                                    {item.label}
                                </Link>
                            </li>
                        ))}

                        <li className={styles.navItem}>
                            {/* Search Dropdown */}
                            <Button
                                color="inherit"
                                onClick={handleMenuOpen}
                                endIcon={<ExpandMoreIcon />}
                                sx={{
                                    color: "white",
                                    textTransform: "none",
                                    fontSize: "inherit",
                                    fontWeight: "inherit",
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Search Properties
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                MenuListProps={{
                                    'aria-labelledby': 'search-button',
                                }}
                            >
                                {searchItems.map((item) => (
                                    <MenuItem
                                        key={item.href}
                                        onClick={handleMenuClose}
                                        component="a"
                                        href={item.href}
                                    >
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </li>
                    </ul>

                    {/* Auth Buttons */}
                    <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
                        <Button
                            variant="text"
                            component={Link}
                            href="/login"
                            sx={{
                                color: "white",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Log in
                        </Button>
                        <Button
                            variant="contained"
                            component={Link}
                            href="/signup"
                            sx={{
                                backgroundColor: "#00d4aa",
                                color: "white",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                borderRadius: "4px",
                                '&:hover': {
                                    backgroundColor: "#00b894"
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </Box>
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
                        ml: "auto"
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
                            bgcolor: 'background.paper'
                        }
                    }}
                >
                    <Box sx={{ pt: 2 }}>
                        <List>
                            {navItems.map((item) => (
                                <ListItem
                                    key={item.href}
                                    button
                                    component="a"
                                    href={item.href}
                                    onClick={toggleDrawer(false)}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            ))}

                            {searchItems.map((item) => (
                                <ListItem
                                    key={item.href}
                                    button
                                    component="a"
                                    href={item.href}
                                    onClick={toggleDrawer(false)}
                                >
                                    <ListItemText primary={item.label} />
                                </ListItem>
                            ))}

                            {/* Auth buttons in mobile drawer */}
                            <ListItem
                                button
                                component="a"
                                href="/login"
                                onClick={toggleDrawer(false)}
                            >
                                <ListItemText primary="Log in" />
                            </ListItem>
                            <ListItem
                                button
                                component="a"
                                href="/signup"
                                onClick={toggleDrawer(false)}
                                sx={{
                                    '& .MuiListItemText-primary': {
                                        color: '#00d4aa',
                                        fontWeight: 500
                                    }
                                }}
                            >
                                <ListItemText primary="Sign Up" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </div>
        </nav>
    );
}