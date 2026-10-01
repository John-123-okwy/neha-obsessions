import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChefHatLogo from "../components/Layout/ChefHatLogo";
import CakeShowcase from "../components/Landing/CakeShowcase";
import LandingHeroSlider from "../components/Landing/LandingHeroSlider";
import StatsStrip from "../components/Landing/StatsStrip";
import Reveal from "../components/Landing/Reveal";
import { getLandingSettings } from "../services/landingSettings";
import { getAllProducts } from "../services/products";
import { ShieldIcon, TruckIcon, SparkleIcon, CakeIcon, TrayIcon, BoxIcon } from "../components/Icons/Icons";
import styles from "./Landing.module.css";

const CATEGORIES = [
  { icon: CakeIcon, label: "Birthday Cakes" },
  { icon: SparkleIcon, label: "Cupcakes" },
  { icon: BoxIcon, label: "Pastries" },
  { icon: CakeIcon, label: "Brownies" },
  { icon: TrayIcon, label: "Desserts" },
  { icon: SparkleIcon, label: "All Treats" },
];

const FEATURES = [
  { icon: ShieldIcon, title: "Premium Quality", text: "We use only the finest ingredients." },
  { icon: SparkleIcon, title: "Hygienically Prepared", text: "Your health and safety are our priority." },
  { icon: TruckIcon, title: "Reliable & On-Time", text: "We ensure your order is ready when you need it." },
  { icon: SparkleIcon, title: "Customer Satisfaction", text: "We bake happiness into every bite." },
];

export default function Landing() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [stats, setStats] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [settings, products] = await Promise.all([
          getLandingSettings(),
          getAllProducts(),
        ]);
        setHeroSlides(settings.heroSlides);
        setStats(settings.stats);
        setBestSellers(products.filter((p) => p.featured && p.available));
      } catch (err) {
        console.error("Failed to load landing data:", err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.page}>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.brand}>
          <span className={styles.mark}><ChefHatLogo size={18} /></span>
          <div>
            <span className={styles.wordmark}>Neha Obsessions</span>
            <span className={styles.brandTag}>Cake that speaks love ♡</span>
          </div>
        </div>
        <Link to="/login" className={styles.signInLink}>Sign In</Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.eyebrow}>Made with love,</span>
          <h1 className={styles.headline}>Baked to <em>perfection.</em> ♡</h1>
          <p className={styles.subtext}>
            Indulge in our handcrafted cakes made with the finest ingredients for your special moments.
          </p>
          <div className={styles.actions}>
            <Link to="/signup" className={styles.primaryBtn}>Shop Cakes →</Link>
            <Link to="/signup" className={styles.secondaryBtn}>Custom Order</Link>
          </div>
          <div className={styles.trustRow}>
            <span><ShieldIcon size={16} /> Quality Ingredients</span>
            <span><TruckIcon size={16} /> On-time Pickup</span>
            <span><SparkleIcon size={14} /> Made with Passion</span>
          </div>
        </div>
        <div className={styles.heroImageWrap}>
          <LandingHeroSlider slides={heroSlides} />
        </div>
      </section>

      <StatsStrip stats={stats} />

      <Reveal>
        <section className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>Shop by Category</h2>
          <div className={styles.categoryGrid}>
            {CATEGORIES.map(({ icon: Icon, label }) => (
              <Link key={label} to="/signup" className={styles.categoryItem}>
                <span className={styles.categoryIcon}><Icon size={22} /></span>
                <span className={styles.categoryLabel}>{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className={styles.showcaseSection}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Best Sellers ♡</h2>
            <Link to="/signup" className={styles.viewAll}>View all →</Link>
          </div>
          <CakeShowcase products={bestSellers} />
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.featuresSection}>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className={styles.featureItem}>
              <span className={styles.featureIcon}><Icon size={20} /></span>
              <div>
                <p className={styles.featureTitle}>{title}</p>
                <p className={styles.featureText}>{text}</p>
              </div>
            </div>
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className={styles.ctaBanner}>
          <div className={styles.ctaText}>
            <span className={styles.ctaEyebrow}>Neha Obsessions</span>
            <h2 className={styles.ctaTitle}>Sweet moments, delivered beautifully.</h2>
            <p className={styles.ctaSubtext}>
              Create your free account to order, track deliveries, and save your favorites — all in one place.
            </p>
            <Link to="/signup" className={styles.ctaBtn}>Create Free Account</Link>
          </div>
          <div className={styles.ctaImageWrap}>
            <img
              src="https://images.unsplash.com/photo-1586985289906-406988974504?w=700"
              alt="Cake slice"
              className={styles.ctaImage}
            />
          </div>
        </section>
      </Reveal>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerBrandRow}>
              <span className={styles.mark}><ChefHatLogo size={16} /></span>
              <span className={styles.footerWordmark}>Neha Obsessions</span>
            </div>
            <p className={styles.footerTagline}>We create moments of happiness with every cake we bake.</p>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Quick Links</p>
            <Link to="/login">Home</Link>
            <Link to="/login">Menu</Link>
            <Link to="/login">Custom Cakes</Link>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Help & Support</p>
            <a href="https://wa.me/2349019938875" target="_blank" rel="noopener noreferrer">Contact Us</a>
            <Link to="/login">FAQs</Link>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Contact</p>
            <span>Nsukka, Enugu State, Nigeria</span>
            <a href="https://wa.me/2349019938875" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© {new Date().getFullYear()} Neha Obsessions. All rights reserved. ♡</span>
          <div className={styles.footerBottomRight}>
            <span className={styles.poweredBy}>Powered by The Excel Foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}