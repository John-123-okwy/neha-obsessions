import { useState, useEffect } from "react";
import styles from "./HeroSlider.module.css";

// TEMPORARY demo images — swap for real client photos via Cloudinary later
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    caption: "Baked fresh, savored fully",
  },
  {
    image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=1200",
    caption: "Every tray, a celebration",
  },
  {
    image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1200",
    caption: "Mornings made easy",
  },
  {
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200",
    caption: "Made for your moments",
  },
];

const SLIDE_DURATION = 4500; // ms between transitions

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.slider}>
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      <div className={styles.overlay} />

      <p className={styles.caption}>{SLIDES[currentIndex].caption}</p>

      <div className={styles.dots}>
        {SLIDES.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}