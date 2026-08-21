import { useRef, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./FeaturedCarousel.module.css";

export default function FeaturedCarousel({ products }) {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 1;
    const gap = 16;
    const index = Math.round(track.scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, products.length - 1));
  }

  function scrollToIndex(index) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 1;
    const gap = 16;
    track.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  }

  return (
    <div>
      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        {products.map((product) => (
          <div key={product.id} className={styles.slide}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 1 && (
        <div className={styles.dots}>
          {products.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}