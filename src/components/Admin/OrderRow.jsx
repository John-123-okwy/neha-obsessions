import { useState } from "react";
import { updateOrderStatus } from "../../services/orders";
import { STATUS_META } from "../../utils/constants";
import styles from "./OrderRow.module.css";

import CustomSelect from "../CustomSelect/CustomSelect";

export default function OrderRow({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const meta = STATUS_META[order.status] || STATUS_META.pending;

  async function handleStatusChange(newStatus) {
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setUpdating(false);
    }
  }

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-NG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className={styles.card}>
      <button
        className={styles.header}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className={styles.headerLeft}>
          <span className={styles.orderId}>#{order.id.slice(-6).toUpperCase()}</span>
          <span className={styles.customerName}>{order.customer?.name}</span>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.date}>{formattedDate}</span>
          <span className={styles.total}>₦{Number(order.totalPrice).toLocaleString()}</span>
          <span
            className={styles.badge}
            style={{ background: `${meta.color}1A`, color: meta.color }}
          >
            {meta.label}
          </span>
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}>
            ▾
          </span>
        </div>
      </button>

      {expanded && (
        <div className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Items</h4>
            {order.items?.map((item) => (
              <div key={item.id} className={styles.itemRow}>
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Customer</h4>
            <p className={styles.detailLine}>{order.customer?.email}</p>
            <p className={styles.detailLine}>{order.customer?.phone}</p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Delivery</h4>
            <p className={styles.detailLine}>
              {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
            </p>
            {order.address && <p className={styles.detailLine}>{order.address}</p>}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Update Status</h4>
            
          <div style={{ maxWidth: 240 }}>
              <CustomSelect
                value={order.status}
                onChange={handleStatusChange}
                options={Object.entries(STATUS_META).map(([key, { label }]) => ({
                  value: key,
                  label,
                }))}
              />
            </div> 
            
      
          </div>
        </div>
      )}
    </div>
  );
}