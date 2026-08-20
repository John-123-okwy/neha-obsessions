import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { subscribeToOrder } from "../services/orders";
import { ORDER_STATUS, STATUS_STEPS } from "../utils/constants";
import styles from "./OrderTracking.module.css";

import Skeleton from "../components/Skeleton/Skeleton";

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrder(id, (data) => {
      setOrder(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

 if (loading) {
    return (
      <div className={styles.wrapper}>
        <Skeleton height="24px" width="50%" style={{ marginBottom: "8px" }} />
        <Skeleton height="14px" width="35%" style={{ marginBottom: "32px" }} />
        <Skeleton height="60px" radius="12px" style={{ marginBottom: "24px" }} />
        <Skeleton height="140px" radius="16px" />
      </div>
    );
  }
 
 
  if (!order) return <p className={styles.status}>Order not found.</p>;

  if (order.status === ORDER_STATUS.CANCELLED) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.cancelledBanner}>
          This order was cancelled. Contact us if you have questions.
        </div>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Order Status</h1>
      <p className={styles.orderId}>Order ID: {order.id}</p>

      <div className={styles.stepper}>
        {STATUS_STEPS.map((step, index) => {
          const isDone = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step.key} className={styles.stepItem}>
              <div className={styles.stepLine}>
                <span
                  className={`${styles.dot} ${isDone ? styles.dotDone : ""} ${isCurrent ? styles.dotCurrent : ""}`}
                />
                {index < STATUS_STEPS.length - 1 && (
                  <span className={`${styles.connector} ${isDone ? styles.connectorDone : ""}`} />
                )}
              </div>
              <span className={`${styles.stepLabel} ${isDone ? styles.stepLabelDone : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.detailsCard}>
        <h2 className={styles.detailsTitle}>Order Details</h2>
        {order.items.map((item) => (
          <div key={item.id} className={styles.itemRow}>
            <span>{item.name} × {item.quantity}</span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className={styles.itemRow}>
          <strong>Total</strong>
          <strong>₦{Number(order.totalPrice).toLocaleString()}</strong>
        </div>
      </div>

      
      <Link to={`/order-confirmation/${order.id}`} className={styles.link}>View Receipt</Link>
      <Link to="/shop" className={styles.link}>Continue Shopping</Link>
      
    </div>
  );
}
