import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CakeShowcase.module.css";

const SHOWCASE_ITEMS = [
  { name: "Chocolate Truffle Cake", price: "2,500", rating: "4.9", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
  { name: "Red Velvet Cake", price: "2,500", rating: "4.8", image: "https://images.unsplash.com/photo-1586985289906-406988974504?w=500" },
  { name: "Blueberry Bliss Cake", price: "2,300", rating: "4.9", image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=500" },
  { name: "Vanilla Cupcakes (6pcs)", price: "1,800", rating: "4.7", image: "https://images.unsplash.com/photo-1607478900766-efe13248b125?w=500" },
  { name: "Classic Small Chops Tray", price: "8,000", rating: "4.8", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500" },
];

export default function CakeShowcase() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

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
  }, []);

  return (
    <div className={styles.track} ref={trackRef}>
      {SHOWCASE_ITEMS.map((item) => (
        <Link key={item.name} to="/signup" className={styles.card}>
          <div className={styles.imageWrap}>
            <img src={item.image} alt={item.name} className={styles.image} />
            <span className={styles.heart}>♡</span>
          </div>
          <p className={styles.name}>{item.name}</p>
          <div className={styles.metaRow}>
            <span className={styles.price}>₦{item.price}</span>
            <span className={styles.rating}>★ {item.rating}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}