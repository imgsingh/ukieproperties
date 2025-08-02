// /mappage
import styles from "../styles/Home.module.css";
import Navbar from "../component/Navbar"
import ListPage from "../component/ListPage";
import Footer from "../component/Footer";

export default function page() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                <ListPage />
            </main>
            <Footer />
        </div>
    );
}
