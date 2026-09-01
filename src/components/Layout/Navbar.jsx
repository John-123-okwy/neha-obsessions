import { Link, useNavigate } from "react-router-dom";
import ChefHatLogo from "./ChefHatLogo";
import { CartIcon } from "../Icons/Icons";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { totalItems } = useCart();
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/home" className={styles.brand}>
        <span className={styles.mark}>
          <ChefHatLogo size={18} />
        </span>
        <span className={styles.wordmark}>Neha Obsessions</span>
      </Link>

      <div className={styles.links}>
        <Link to="/shop" className={styles.navLink}>Shop</Link>
        <Link to="/orders" className={styles.navLink}>Orders</Link>
        {/*<Link to="/account" className={styles.navLink}>Account</Link>*/}
        {isAdmin && (
          <Link to="/admin" className={styles.adminLink}>Admin</Link>
        )}
        <Link to="/cart" className={styles.cartLink} aria-label="View cart">
          <CartIcon size={20} />
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
      </div>
    </nav>
  );
}