// /mappage
import styles from "../styles/Home.module.css";
import Navbar from "../component/Navbar"
import ListPage from "../component/ListPage";

export default function page() {
    return (
        <div className={styles.container}>
            <Navbar />
            <main>
                <ListPage />
            </main>
        </div>
    );
}
