import styles from "./LoadingOverlay.module.css";

export default function LoadingOverlay({ message }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}