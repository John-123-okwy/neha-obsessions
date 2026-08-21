import { Link } from "react-router-dom";
import ChefHatLogo from "./ChefHatLogo";
import { CartIcon } from "../Icons/Icons";
import { useCart } from "../../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <span className={styles.mark}>
          <ChefHatLogo size={18} />
        </span>
        <span className={styles.wordmark}>Neha Obsessions</span>
      </Link>

      <div className={styles.links}>
        <Link to="/shop" className={styles.navLink}>Shop</Link>
        <Link to="/cart" className={styles.cartLink} aria-label="View cart">
          <CartIcon size={20} />
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </Link>
        <Link to="/#shop" className={styles.orderBtn}>Order Now</Link>
      </div>
    </nav>
  );
}