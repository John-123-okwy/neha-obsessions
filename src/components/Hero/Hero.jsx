import HeroSlider from "./HeroSlider";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <HeroSlider />

      <div className={styles.content}>
        <span className={styles.eyebrow}>Neha Obsessions</span>
        <h1 className={styles.headline}>
          Every Bite.<br />Worth <em>Obsessing</em> Over.
        </h1>
        <p className={styles.subtext}>
          Custom cakes, small chops trays, and breakfast boxes — freshly made for every moment.
        </p>
        <div className={styles.actions}>
          <a href="#shop" className={styles.primaryBtn}>Order Now</a>
          <a href="#highlights" className={styles.secondaryBtn}>Explore Menu</a>
        </div>
      </div>
    </section>
  );
}