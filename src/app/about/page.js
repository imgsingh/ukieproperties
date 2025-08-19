// pages/about.js

import Navbar from "../component/Navbar";
import styles from "../styles/About.module.css";
import Footer from "../component/Footer";
import Image from "next/image";

export default function About() {
    return (
        <div className={styles.container}>
            <Navbar />
            <br />
            <div className={styles.newclass}>
                {/* Hero Section */}
                <header className={styles.header}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1 className={styles.title}>Home Assist</h1>
                            <p className={styles.subtitle}>
                                Your bridge to property success
                            </p>
                            <p className={styles.heroDescription}>
                                Unifying the UK and Ireland property market through innovative technology
                            </p>
                        </div>
                        <div className={styles.heroImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                alt="Modern house exterior"
                                width={500}
                                height={300}
                                className={styles.heroImg}
                                priority
                            />
                        </div>
                    </div>
                </header>

                {/* Who We Are Section */}
                <section className={styles.section}>
                    <div className={styles.sectionWithImage}>
                        <div className={styles.sectionText}>
                            <h2 className={styles.sectionTitle}>Who We Are</h2>
                            <p className={styles.sectionContent}>
                                The property search landscape across the UK and Ireland is currently fragmented and inefficient, creating significant challenges for prospective buyers, renters, and property professionals. Users seeking properties across these regions must navigate multiple separate platforms including Daft.ie, MyHome.ie, OnTheMarket, Rightmove, and Zoopla, each with distinct interfaces, search functionalities, and coverage areas.
                            </p>
                            <p className={styles.sectionContent}>
                                This fragmentation forces users to repeat searches across numerous websites, leading to time-consuming and frustrating property hunting experiences, while potentially missing suitable properties due to platform limitations.
                            </p>
                        </div>
                        <div className={styles.sectionImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                alt="Beautiful residential property"
                                width={400}
                                height={250}
                                className={styles.sectionImg}
                            />
                        </div>
                    </div>
                </section>

                {/* Mission Section */}
                <section className={styles.section}>
                    <div className={styles.sectionWithImage}>
                        <div className={styles.sectionImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                alt="Modern living room interior"
                                width={400}
                                height={250}
                                className={styles.sectionImg}
                            />
                        </div>
                        <div className={styles.sectionText}>
                            <h2 className={styles.sectionTitle}>Our Mission</h2>
                            <p className={styles.sectionContent}>
                                Our mission is to simplify the property search process and empower our clients with the tools and resources they need to make informed decisions. We aim to create a seamless experience for buyers, sellers, and investors alike.
                            </p>
                            <p className={styles.sectionContent}>
                                By leveraging cutting-edge technology and data analytics, we're building the future of property search – one that puts users first and eliminates the frustration of fragmented platforms.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Vision Section */}
                <section className={styles.section}>
                    <div className={styles.sectionWithImage}>
                        <div className={styles.sectionText}>
                            <h2 className={styles.sectionTitle}>Our Vision</h2>
                            <p className={styles.sectionContent}>
                                Our vision is to provide a unified platform that consolidates the UK and Ireland property market, offering a single, comprehensive search experience. By consolidating the fragmented property search landscape, we aim to make it easier for users to find the properties they need, whether they are buying, selling, or investing.
                            </p>
                            <p className={styles.sectionContent}>
                                Our goal is to become the go-to destination for property seekers, enabling them to access a wider range of properties and make informed decisions with confidence.
                            </p>
                        </div>
                        <div className={styles.sectionImage}>
                            <Image
                                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                alt="Luxury house with garden"
                                width={400}
                                height={250}
                                className={styles.sectionImg}
                            />
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className={styles.valuesSection}>
                    <h2 className={styles.sectionTitle}>Our Values</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>🏠</div>
                            <h3>Integrity</h3>
                            <p>We prioritize honesty and transparency in all our dealings.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>👥</div>
                            <h3>Customer Focus</h3>
                            <p>Your satisfaction is our top priority.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>💡</div>
                            <h3>Innovation</h3>
                            <p>We embrace technology to deliver the best solutions.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <div className={styles.valueIcon}>⭐</div>
                            <h3>Excellence</h3>
                            <p>We are committed to providing top-notch service.</p>
                        </div>
                    </div>
                </section>

                {/* Property Showcase */}
                <section className={styles.showcaseSection}>
                    <h2 className={styles.sectionTitle}>Property Excellence</h2>
                    <div className={styles.propertyGrid}>
                        <div className={styles.propertyCard}>
                            <Image
                                src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                                alt="Cottage style home"
                                width={300}
                                height={200}
                                className={styles.propertyImg}
                            />
                        </div>
                        <div className={styles.propertyCard}>
                            <Image
                                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                                alt="Modern apartment building"
                                width={300}
                                height={200}
                                className={styles.propertyImg}
                            />
                        </div>
                        <div className={styles.propertyCard}>
                            <Image
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                                alt="Contemporary house design"
                                width={300}
                                height={200}
                                className={styles.propertyImg}
                            />
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}