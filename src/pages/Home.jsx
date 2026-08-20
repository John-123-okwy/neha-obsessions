import { useEffect, useState } from "react";
import { getAllProducts } from "../services/products";
import Hero from "../components/Hero/Hero";
import ProductCard from "../components/ProductCard/ProductCard";
import WhatsAppButton from "../components/WhatsAppButton/WhatsAppButton";
import Skeleton from "../components/Skeleton/Skeleton";
import styles from "./Home.module.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const allProducts = await getAllProducts();
        const featured = allProducts.filter(
          (p) => p.featured && p.available
        );
        setFeaturedProducts(featured);
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
      <section id="shop" className={styles.featured}>
        <h2 className={styles.title}>Featured This Week</h2>

        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="280px" radius="16px" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <p className={styles.empty}>
            Nothing featured right now — check out the full{" "}
            <a href="/shop">shop</a>.
          </p>
        ) : (
          <div className={styles.grid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      <WhatsAppButton />
    </>
  );
}