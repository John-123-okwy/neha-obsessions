import { forwardRef } from "react";
import ChefHatLogo from "../Layout/ChefHatLogo";
import { STATUS_META } from "../../utils/constants";
import styles from "./Receipt.module.css";

const Receipt = forwardRef(function Receipt({ order }, ref) {
  const meta = STATUS_META[order.status] || STATUS_META.confirmed;
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  return (
    <div className={styles.receipt} ref={ref}>
      <div className={styles.brandRow}>
        <div className={styles.logoBadge}>
          <ChefHatLogo size={20} />
        </div>
        <span className={styles.brandName}>Neha Obsessions</span>
      </div>

      <p className={styles.receiptLabel}>Payment Receipt</p>
      <span
        className={styles.statusPill}
        style={{ background: `${meta.color}1A`, color: meta.color }}
      >
        {meta.label}
      </span>

      <div className={styles.metaGrid}>
        <div>
          <p className={styles.metaLabel}>Order ID</p>
          <p className={styles.metaValue}>{order.id}</p>
        </div>
        <div>
          <p className={styles.metaLabel}>Date</p>
          <p className={styles.metaValue}>{dateStr}</p>
        </div>
      </div>

      <div className={styles.divider} />

      <p className={styles.sectionTitle}>Billed To</p>
      <p className={styles.line}>{order.customer?.name}</p>
      <p className={styles.line}>{order.customer?.email}</p>
      <p className={styles.line}>{order.customer?.phone}</p>

      <div className={styles.divider} />

      <p className={styles.sectionTitle}>
        {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
      </p>
      {order.deliveryMethod === "pickup" ? (
        <p className={styles.line}>Customer pickup</p>
      ) : (
        <>
          {order.deliveryZone && <p className={styles.line}>{order.deliveryZone.name}</p>}
          {order.address && <p className={styles.line}>{order.address}</p>}
        </>
      )}

      <div className={styles.divider} />

      <p className={styles.sectionTitle}>Items</p>
      {order.items?.map((item) => (
        <div key={item.id} className={styles.itemRow}>
          <span>{item.name} × {item.quantity}</span>
          <span>₦{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      <div className={styles.divider} />

      <div className={styles.itemRow}>
        <span>Subtotal</span>
        <span>₦{Number(order.subtotal ?? order.totalPrice).toLocaleString()}</span>
      </div>
      {order.deliveryMethod === "delivery" && (
        <div className={styles.itemRow}>
          <span>Delivery Fee</span>
          <span>₦{Number(order.deliveryFee || 0).toLocaleString()}</span>
        </div>
      )}
      <div className={styles.totalRow}>
        <span>Total Paid</span>
        <span>₦{Number(order.totalPrice).toLocaleString()}</span>
      </div>

      <p className={styles.refLine}>Ref: {order.paymentReference}</p>

      <div className={styles.thanksBox}>
        Thank you for choosing Neha Obsessions — every bite tells you why we're called Obsessions. 💜
      </div>

      <div className={styles.zigzagTop} aria-hidden="true" />
      <p className={styles.footer}>Powered by The Excel Foundation</p>
    </div>
  );
});

export default Receipt;