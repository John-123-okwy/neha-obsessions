import { useEffect, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import styles from "./StatsStrip.module.css";

function CountUpValue({ value, suffix }) {
  const [ref, visible] = useScrollReveal();
  const [display, setDisplay] = useState(0);
  const target = Number(value) || 0;

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [visible, target]);

  return (
    <span ref={ref} className={styles.value}>
      {display.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsStrip({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className={styles.strip}>
      {stats.map((stat) => (
        <div key={stat.id} className={styles.item}>
          <CountUpValue value={stat.value} suffix={stat.suffix || ""} />
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}