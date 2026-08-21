import { useEffect, useState } from "react";
import { getAllProducts } from "../services/products";
import Hero from "../components/Hero/Hero";
import HeroHighlights from "../components/Hero/HeroHighlights";
import FeaturedCarousel from "../components/FeaturedCarousel/FeaturedCarousel";
import WhatsAppButton from "../components/WhatsAppButton/WhatsAppButton";
import Skeleton from "../components/Skeleton/Skeleton";
import { ShieldIcon, TruckIcon, SparkleIcon } from "../components/Icons/Icons";
import styles from "./Home.module.css";

const TRUST_ITEMS = [
  { icon: SparkleIcon, title: "Freshly Made", text: "Every order is made fresh." },
  { icon: ShieldIcon, title: "Secure Checkout", text: "Safe, encrypted payments." },
  { icon: TruckIcon, title: "Fast Delivery", text: "Quick delivery to your doorstep." },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const allProducts = await getAllProducts();
        setFeaturedProducts(allProducts.filter((p) => p.featured && p.available));
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <>
      <Hero />
      <HeroHighlights />

      <section id="shop" className={styles.featured}>
        <div className={styles.sectionHead}>
          <h2 className={styles.title}>Featured This Week</h2>
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <SparkleIcon size={14} />
            <span className={styles.dividerLine} />
          </div>
          <p className={styles.tagline}>Handpicked treats you'll love</p>
        </div>

        {loading ? (
          <div className={styles.skeletonRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="300px" radius="16px" style={{ minWidth: "260px" }} />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className={styles.empty}>
            Nothing featured right now — check out the full <a href="/shop">shop</a>.
          </p>
        ) : (
          <FeaturedCarousel products={featuredProducts} />
        )}
      </section>

      <section className={styles.trustSection}>
        {TRUST_ITEMS.map(({ icon: Icon, title, text }) => (
          <div key={title} className={styles.trustItem}>
            <Icon size={22} />
            <div>
              <p className={styles.trustTitle}>{title}</p>
              <p className={styles.trustText}>{text}</p>
            </div>
          </div>
        ))}
      </section>

      <WhatsAppButton />
    </>
  );
}