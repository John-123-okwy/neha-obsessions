import { useState, useEffect } from "react";
import { getOptimizedUrl } from "../../services/cloudinary";
import styles from "./LandingHeroSlider.module.css";

const FALLBACK_SLIDE = {
  image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1400",
  caption: "",
};

export default function LandingHeroSlider({ slides }) {
  const activeSlides = slides && slides.length > 0 ? slides : [FALLBACK_SLIDE];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % activeSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className={styles.slider}>
      {activeSlides.map((slide, i) => (
        <div
          key={slide.id || i}
          className={`${styles.slide} ${i === index ? styles.active : ""}`}
          style={{ backgroundImage: `url(${getOptimizedUrl(slide.image, { width: 1200, height: 1200 })})` }}
        />
      ))}
      <div className={styles.overlay} />
      {activeSlides.length > 1 && (
        <div className={styles.dots}>
          {activeSlides.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}