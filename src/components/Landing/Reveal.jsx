import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./Reveal.module.css";

export default function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}