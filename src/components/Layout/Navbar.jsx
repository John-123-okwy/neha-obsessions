import { Link } from "react-router-dom";
import ChefHatLogo from "./ChefHatLogo";
import { useCart } from "../../context/CartContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoPill}>
        <ChefHatLogo size={20} />
        <span>Neha Obsessions</span>
      </Link>

      <div className={styles.links}>
        <Link to="/shop" className={styles.navLink}>Shop</Link>
        <Link to="/cart" className={styles.navLink}>
          Cart{totalItems > 0 ? ` (${totalItems})` : ""}
        </Link>
        <Link to="/#shop" className={styles.orderBtn}>Order Now</Link>
      </div>
    </nav>
  );
}