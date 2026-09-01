import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { STATUS_META, STATUS_STEPS, ORDER_STATUS } from "../../utils/constants";
import { getOptimizedUrl } from "../../services/cloudinary";
import styles from "./OrderCard.module.css";

export default function OrderCard({ order }) {
  const { addToCart } = useCart();
  const meta = STATUS_META[order.status] || STATUS_META.pending;

  const isOngoing = ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status);
  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  const paidAt = order.createdAt ? new Date(order.createdAt) : null;
  const dateStr = paidAt
    ? paidAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "";
  const timeStr = paidAt
    ? paidAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true })
    : "";

  const firstItem = order.items?.[0];
  const extraCount = (order.items?.length || 1) - 1;

  function handleOrderAgain() {
    order.items?.forEach((item) => addToCart(item, item.quantity));
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <p className={styles.orderIdLabel}>Order ID</p>
          <p className={styles.orderId}>{order.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.date}>{dateStr}, {timeStr}</p>
          <p className={styles.itemsSummary}>
            {order.items?.length || 0} item{order.items?.length === 1 ? "" : "s"} • ₦{Number(order.totalPrice).toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.body}>
        {firstItem && (
          <img
            src={getOptimizedUrl(firstItem.image, { width: 120, height: 120 })}
            alt={firstItem.name}
            className={styles.thumb}
          />
        )}
        <div className={styles.info}>
          <p className={styles.itemName}>
            {firstItem?.name} × {firstItem?.quantity}
            {extraCount > 0 && <span className={styles.extra}> +{extraCount} more</span>}
          </p>
          <p className={styles.method}>
            {order.deliveryMethod === "pickup" ? "Customer pickup" : order.deliveryZone?.name || "Delivery"}
          </p>
          <span
            className={styles.statusBadge}
            style={{ background: `${meta.color}1A`, color: meta.color }}
          >
            {meta.label}
          </span>
        </div>
      </div>

      {isOngoing && (
        <div className={styles.stepper}>
          {STATUS_STEPS.map((step, index) => (
            <div key={step.key} className={styles.stepItem}>
              <span className={`${styles.dot} ${index <= currentIndex ? styles.dotDone : ""}`} />
              {index < STATUS_STEPS.length - 1 && (
                <span className={`${styles.connector} ${index < currentIndex ? styles.connectorDone : ""}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <Link to={`/order-confirmation/${order.id}`} className={styles.receiptLink}>
          View Receipt
        </Link>
        {isOngoing ? (
          <Link to={`/order/${order.id}`} className={styles.primaryBtn}>
            Track Order →
          </Link>
        ) : (
          <button className={styles.secondaryBtn} onClick={handleOrderAgain}>
            Order Again ↻
          </button>
        )}
      </div>
    </div>
  );
}