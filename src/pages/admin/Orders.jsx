import { useEffect, useState } from "react";
import { subscribeToAllOrders } from "../../services/orders";
import { STATUS_META } from "../../utils/constants";
import OrderRow from "../../components/Admin/OrderRow";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./Orders.module.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      order.customer?.name?.toLowerCase().includes(searchLower) ||
      order.customer?.phone?.includes(search) ||
      order.id.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1 className={styles.title}>Orders</h1>

      <input
        className={styles.searchInput}
        placeholder="Search by name, phone, or order ID…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${statusFilter === "all" ? styles.tabActive : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        {Object.entries(STATUS_META).map(([key, { label }]) => (
          <button
            key={key}
            className={`${styles.tab} ${statusFilter === key ? styles.tabActive : ""}`}
            onClick={() => setStatusFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="64px" radius="16px" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <p className={styles.empty}>No orders match this view.</p>
      ) : (
        <div className={styles.list}>
          {filteredOrders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}