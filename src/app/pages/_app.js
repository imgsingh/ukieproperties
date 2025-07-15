// pages/_app.js

import Navbar from "../components/Navbar";
import "../styles/globals.css";
import 'toastr/build/toastr.min.css';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
