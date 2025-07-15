import Link from "next/link";
import styles from "../styles/Navbar.module.css"; // We'll add custom CSS for styling
import image from '../assets/images/house-icon.png'

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40" height="40"
                        viewBox="0 0 200 300"
                    >
                        <path d="M100,0 C155,0 200,45 200,100 C200,190 100,300 100,300 C100,300 0,190 0,100 C0,45 45,0 100,0 Z" fill="#00963f" />
                        <polygon points="50,120 150,120 150,200 50,200" fill="white" />
                        <polygon points="40,120 100,50 160,120" fill="white" />
                        <rect x="70" y="150" width="20" height="20" fill="#00963f" />
                        <rect x="110" y="150" width="20" height="50" fill="#00963f" />
                    </svg>
                    <span>UKIE Properties</span>
                </Link>

                <ul className={styles.navList}>
                    <li className={styles.navItem}>
                        <Link href="/" className={styles.navLink}>
                            Home
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/about" className={styles.navLink}>
                            About Us
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/map-search" className={styles.navLink}>
                            Map Search
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/list-search" className={styles.navLink}>
                            List Search
                        </Link>
                    </li>
                    <li className={styles.navItem}>
                        <Link href="/advance-search" className={styles.navLink}>
                            Advance Search
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
