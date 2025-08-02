// /mappage
"use client"
import styles from "../styles/Home.module.css";
import Navbar from "../component/Navbar"
import PropertyAnalyticsDashboard from "../component/PropertyAnalyticsDashboard"
import Footer from "../component/Footer";

export default function page() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                <PropertyAnalyticsDashboard />
            </main>
            <Footer />
        </div>
    );
}
