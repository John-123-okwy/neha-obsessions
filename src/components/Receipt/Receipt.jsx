import { forwardRef } from "react";
import ChefHatLogo from "../Layout/ChefHatLogo";
import { STATUS_META } from "../../utils/constants";
import styles from "./Receipt.module.css";

const Receipt = forwardRef(function Receipt({ order }, ref) {
  const meta = STATUS_META[order.status] || STATUS_META.confirmed;
  const paidAt = order.createdAt ? new Date(order.createdAt) : null;

  const dateStr = paidAt
    ? paidAt.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const timeStr = paidAt
    ? paidAt.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "—";

  return (
    <div className={styles.receipt} ref={ref}>
      <div className={styles.brandRow}>
        <span className={styles.logoBadge}><ChefHatLogo size={18} /></span>
        <span className={styles.brandName}>Neha Obsessions</span>
      </div>

      <p className={styles.amountLabel}>Amount Paid</p>
      <p className={styles.amount}>₦{Number(order.totalPrice).toLocaleString()}</p>
      <span
        className={styles.statusPill}
        style={{ background: `${meta.color}1A`, color: meta.color }}
      >
        {meta.label}
      </span>

      <div className={styles.divider} />

      <div className={styles.detailRow}><span>Order ID</span><span>{order.id}</span></div>
      <div className={styles.detailRow}><span>Date</span><span>{dateStr}</span></div>
      <div className={styles.detailRow}><span>Time</span><span>{timeStr}</span></div>
      <div className={styles.detailRow}><span>Customer</span><span>{order.customer?.name}</span></div>
      <div className={styles.detailRow}><span>Phone</span><span>{order.customer?.phone}</span></div>
      <div className={styles.detailRow}>
        <span>{order.deliveryMethod === "pickup" ? "Method" : "Delivery"}</span>
        <span>{order.deliveryMethod === "pickup" ? "Pickup" : order.deliveryZone?.name || "Delivery"}</span>
      </div>

      <div className={styles.divider} />

      {order.items?.map((item) => (
        <div key={item.id} className={styles.detailRow}>
          <span>{item.name} × {item.quantity}</span>
          <span>₦{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.detailRow}>
        <span>Subtotal</span>
        <span>₦{Number(order.subtotal ?? order.totalPrice).toLocaleString()}</span>
      </div>
      {order.deliveryMethod === "delivery" && (
        <div className={styles.detailRow}>
          <span>Delivery Fee</span>
          <span>₦{Number(order.deliveryFee || 0).toLocaleString()}</span>
        </div>
      )}
      <div className={styles.totalRow}>
        <span>Total</span>
        <span>₦{Number(order.totalPrice).toLocaleString()}</span>
      </div>

      <p className={styles.refLine}>Ref: {order.paymentReference}</p>
      <p className={styles.thanks}>Thank you for choosing Neha Obsessions 💜</p>

      <div className={styles.zigzagTop} aria-hidden="true" />
      <p className={styles.footer}>Powered by The Excel Foundation</p>
    </div>
  );
});

export default Receipt;