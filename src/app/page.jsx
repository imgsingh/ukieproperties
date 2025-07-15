// pages/index.js
import styles from "../app/styles/Home.module.css";
import Navbar from "../app/component/Navbar"
import NewsHomepage from "../app/component/NewsHomepage";

export default function Home() {

  return (
    <div className={styles.container}>
      <Navbar />
      <main>
        <NewsHomepage />
      </main>
    </div>
  );
}
