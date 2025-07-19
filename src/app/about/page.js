// pages/about.js

import Navbar from "../component/Navbar";
import styles from "../styles/About.module.css";

export default function About() {
    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.newclass}>
                <header className={styles.header}>
                    <h1 className={styles.title}>About Us</h1>
                    <p className={styles.subtitle}>
                        Your trusted partner in finding the perfect property.
                    </p>
                </header>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Who We Are</h2>
                    <p className={styles.sectionContent}>
                        At UK Ireland Properties, we specialize in connecting buyers and sellers with the best properties across the UK and Ireland. With years of experience in the real estate market, we are committed to providing exceptional service and helping you find your dream home or investment property.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.sectionContent}>
                        Our mission is to simplify the property search process and empower our clients with the tools and resources they need to make informed decisions. We aim to create a seamless experience for buyers, sellers, and investors alike.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Vision</h2>
                    <p className={styles.sectionContent}>
                        We envision a future where finding and investing in properties is effortless and transparent. By leveraging technology and market expertise, we strive to be the leading property platform in the UK and Ireland.
                    </p>
                </section>
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Values</h2>
                    <ul className={styles.valuesList}>
                        <li>Integrity: We prioritize honesty and transparency in all our dealings.</li>
                        <li>Customer Focus: Your satisfaction is our top priority.</li>
                        <li>Innovation: We embrace technology to deliver the best solutions.</li>
                        <li>Excellence: We are committed to providing top-notch service.</li>
                    </ul>
                </section>
            </div>
            <footer className={styles.footer}>
                <p>
                    Thank you for choosing UK Ireland Properties. We look forward to helping you find your perfect property.
                </p>
            </footer>
        </div>
    );
}
