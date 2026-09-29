import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrdersByCustomerId } from "../services/orders";
import { ORDER_STATUS } from "../utils/constants";
import OrderCard from "../components/OrdersHistory/OrderCard";
import Skeleton from "../components/Skeleton/Skeleton";
import { BoxIcon } from "../components/Icons/Icons";
import styles from "./OrdersHistory.module.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export default function OrdersHistory() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await getOrdersByCustomerId(currentUser.uid);
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Failed to lcoad orders:", err);
        setError("Couldn't load your orders right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [currentUser]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "ongoing") {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status);
    }
    return order.status === activeTab;
  });

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My Orders</h1>

      <div className={styles.tabs}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div>
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} height="220px" radius="16px" style={{ marginBottom: "16px" }} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>Something went wrong</p>
          <p className={styles.emptyText}>{error}</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}><BoxIcon size={32} /></span>
          <p className={styles.emptyTitle}>
            {orders.length === 0 ? "No orders yet" : "Nothing here"}
          </p>
          <p className={styles.emptyText}>
            {orders.length === 0
              ? "When you place an order, it'll show up here."
              : "No orders match this filter."}
          </p>
          {orders.length === 0 && (
            <Link to="/shop" className={styles.shopBtn}>Start Shopping</Link>
          )}
        </div>
      ) : (
        filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}