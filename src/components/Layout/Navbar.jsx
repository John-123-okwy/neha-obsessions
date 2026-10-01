import { useState, useRef, useEffect } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    setMenuOpen(false);
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

      {/* Desktop links — hidden on mobile via CSS */}
      <div className={styles.desktopLinks}>
        <Link to="/shop" className={styles.navLink}>Shop</Link>
        <Link to="/orders" className={styles.navLink}>Orders</Link>
        <Link to="/account" className={styles.navLink}>Account</Link>
        {isAdmin && (
          <Link to="/admin" className={styles.adminLink}>Admin</Link>
        )}
        <Link to="/cart" className={styles.cartLink} aria-label="View cart">
          <CartIcon size={20} />
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
      </div>

      {/* Mobile: cart always visible + hamburger menu for the rest */}
      <div className={styles.mobileControls}>
        <Link to="/cart" className={styles.cartLink} aria-label="View cart">
          <CartIcon size={20} />
          {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
        </Link>

        <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>

          {menuOpen && (
            <div className={styles.dropdown}>
              <Link to="/shop" className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                Shop
              </Link>
              <Link to="/orders" className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                Orders
              </Link>
              <Link to="/account" className={styles.dropdownLink} onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`${styles.dropdownLink} ${styles.dropdownAdminLink}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <button className={styles.dropdownLogoutBtn} onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}