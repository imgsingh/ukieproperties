// pages/about.js

import Navbar from "../component/Navbar";
import styles from "../styles/About.module.css";

export default function About() {
    return (
        <div className={styles.container}>
            <Navbar />
            <h1>About Us</h1>
            <p>
                Welcome to our property website! We offer a wide selection of luxury properties for sale.
                Our mission is to help you find your dream home with ease and confidence.
            </p>
        </div>
    );
}
