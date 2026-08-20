import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orders";
import Receipt from "../components/Receipt/Receipt";
import ReceiptActions from "../components/Receipt/ReceiptActions";
import Skeleton from "../components/Skeleton/Skeleton";
import styles from "./OrderConfirmation.module.css";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef(null);

  useEffect(() => {
    async function loadOrder() {
      const data = await getOrderById(id);
      setOrder(data);
      setLoading(false);
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <Skeleton height="24px" width="60%" style={{ margin: "0 auto 16px" }} />
        <Skeleton height="360px" radius="16px" />
      </div>
    );
  }

  if (!order) return <p className={styles.status}>Order not found.</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Order Confirmed 🎉</h1>
      <p className={styles.subtext}>Thank you, {order.customer?.name}! Here's your receipt.</p>

      <Receipt order={order} ref={receiptRef} />
      <ReceiptActions targetRef={receiptRef} fileName={`neha-obsessions-receipt-${order.id.slice(-6)}`} />

      <div className={styles.links}>
        <Link to={`/order/${order.id}`} className={styles.link}>Track Your Order</Link>
        <Link to="/shop" className={styles.link}>Continue Shopping</Link>
      </div>
    </div>
  );
}