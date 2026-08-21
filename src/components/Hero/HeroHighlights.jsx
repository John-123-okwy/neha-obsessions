import { TrayIcon, BoxIcon, CakeIcon } from "../Icons/Icons";
import styles from "./HeroHighlights.module.css";

const HIGHLIGHTS = [
  { icon: TrayIcon, label: "Small Chops Trays" },
  { icon: BoxIcon, label: "Breakfast Boxes" },
  { icon: CakeIcon, label: "Custom Cakes" },
];

export default function HeroHighlights() {
  return (
    <div id="highlights" className={styles.wrapper}>
      <div className={styles.card}>
        {HIGHLIGHTS.map(({ icon: Icon, label }, i) => (
          <div key={label} className={styles.item}>
            <Icon size={24} />
            <span className={styles.label}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}