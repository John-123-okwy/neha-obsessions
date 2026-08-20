import Skeleton from "./Skeleton";
import styles from "../ProductCard/ProductCard.module.css";

export default function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Skeleton height="180px" radius="0" />
      <div className={styles.body}>
        <Skeleton height="18px" width="70%" style={{ marginBottom: "10px" }} />
        <Skeleton height="14px" width="90%" style={{ marginBottom: "6px" }} />
        <Skeleton height="14px" width="60%" style={{ marginBottom: "16px" }} />
        <Skeleton height="32px" width="40%" radius="999px" />
      </div>
    </div>
  );
}