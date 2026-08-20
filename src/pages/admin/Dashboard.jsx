import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/products";
import { getAllCategories } from "../../services/categories";
import { getAllOrders } from "../../services/orders";
import { ORDER_STATUS } from "../../utils/constants";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, categories, orders] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllOrders(),
        ]);

        const revenue = orders
          .filter((o) => o.status !== ORDER_STATUS.CANCELLED)
          .reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

        const pendingCount = orders.filter(
          (o) => o.status === ORDER_STATUS.CONFIRMED || o.status === ORDER_STATUS.PREPARING
        ).length;

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          pendingOrders: pendingCount,
          revenue,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Revenue", value: stats ? `₦${stats.revenue.toLocaleString()}` : "" },
    { label: "Total Orders", value: stats?.totalOrders },
    { label: "Pending Orders", value: stats?.pendingOrders },
    { label: "Products", value: stats?.totalProducts },
    { label: "Categories", value: stats?.totalCategories },
  ];

  return (
    <div>
      <h1 className={styles.title}>Dashboard Overview</h1>
      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.label} className={styles.card}>
            <span className={styles.cardLabel}>{card.label}</span>
            {loading ? (
              <Skeleton height="28px" width="60%" />
            ) : (
              <span className={styles.cardValue}>{card.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}