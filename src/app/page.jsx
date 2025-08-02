// pages/index.js
import styles from "../app/styles/Home.module.css";
import Navbar from "../app/component/Navbar"
import NewsHomepage from "../app/component/NewsHomepage";
import Footer from "../app/component/Footer";

export default function Home() {

  return (
    <div className={styles.container}>
      <Navbar />
      <main>
        <NewsHomepage />
      </main>
      <Footer />
    </div>
  );
}
