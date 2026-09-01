import { Link } from "react-router-dom";
import ChefHatLogo from "./ChefHatLogo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.mark}><ChefHatLogo size={16} /></span>
          <span className={styles.wordmark}>Neha Obsessions</span>
        </div>
        <p className={styles.tagline}>Every bite tells you why we're called Obsessions.</p>
      </div>

      <div className={styles.links}>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <a href="https://wa.me/2349019938875" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Neha Obsessions</span>
      </div>
    </footer>
  );
}