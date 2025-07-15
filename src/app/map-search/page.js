"use client"
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import Navbar from "../component/Navbar";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("../component/Map"), { ssr: false });

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.spacing(2),
    backgroundColor: "#f5f5f5",
    marginBottom: theme.spacing(3),
}));

export default function Page() {
    return (
        <div className={styles.container}>
            <Navbar />
            <StyledPaper>
                <Typography variant="h4" sx={{ textAlign: "center", color: "#1976d2", fontWeight: "bold" }}>
                    AI-Based Search
                </Typography>
                <Map />
            </StyledPaper>
        </div>
    );
}