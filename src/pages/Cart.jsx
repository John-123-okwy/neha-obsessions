import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty.</p>
        <Link to="/shop" className={styles.shopLink}>Browse the Shop</Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Your Cart</h1>

      <div className={styles.list}>
        {items.map((item) => (
          <div key={item.id} className={styles.row}>
            <img src={item.image} alt={item.name} className={styles.thumb} />
            <div className={styles.details}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.price}>₦{Number(item.price).toLocaleString()}</p>
            </div>
            <div className={styles.qtyControls}>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button
              className={styles.removeBtn}
              onClick={() => removeFromCart(item.id)}
              aria-label={`Remove ${item.name}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <span className={styles.totalLabel}>Total</span>
        <span className={styles.totalValue}>₦{totalPrice.toLocaleString()}</span>
      </div>

      <Link to="/checkout" className={styles.checkoutBtn}>Proceed to Checkout</Link>
    </div>
  );
}