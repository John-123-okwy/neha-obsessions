import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2349019938875"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Order via WhatsApp"
    >
      WhatsApp
    </a>
  );
}