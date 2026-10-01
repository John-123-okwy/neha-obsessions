import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { getOptimizedUrl } from "../../services/cloudinary";
import styles from "./CakeShowcase.module.css";

export default function CakeShowcase({ products }) {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || products.length <= 1) return;

    const interval = setInterval(() => {
      const cardWidth = track.firstChild?.offsetWidth || 280;
      const gap = 16;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) {
    return <p className={styles.empty}>Check back soon for our best sellers.</p>;
  }

  return (
    <div className={styles.track} ref={trackRef}>
      {products.map((product) => (
        <Link key={product.id} to="/signup" className={styles.card}>
          <div className={styles.imageWrap}>
            <img
              src={getOptimizedUrl(product.images?.[0], { width: 400, height: 300 })}
              alt={product.name}
              className={styles.image}
            />
            <span className={styles.heart}>♡</span>
          </div>
          <p className={styles.name}>{product.name}</p>
          <div className={styles.metaRow}>
            <span className={styles.price}>₦{Number(product.price).toLocaleString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}