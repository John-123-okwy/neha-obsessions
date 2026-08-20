import HeroSlider from "./HeroSlider";
import styles from "./Hero.module.css";

const MARQUEE_ITEMS = [
  "Red Velvet Cakes", "Small Chops Trays", "Breakfast Boxes",
  "Custom Wedding Cakes", "Meat Pies", "Puff Puff", "Birthday Cakes",
];

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroSlider />

      <div className={styles.content}>
        <span className={styles.eyebrow}>Neha Obsessions</span>
        <h1 className={styles.headline}>
          Every Bite Tells You Why<br />We're Called Obsessions
        </h1>
        <p className={styles.subtext}>
          Custom cakes, small chops trays, and breakfast boxes — baked fresh, made for the moment.
        </p>
        <div className={styles.actions}>
          <a href="#shop" className={styles.primaryBtn}>Order Now</a>
          <a href="#categories" className={styles.secondaryBtn}>View Menu</a>
        </div>
      </div>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className={styles.marqueeItem}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}