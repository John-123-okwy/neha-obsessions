import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategories } from "../../services/categories";
import { TrayIcon, BoxIcon, CakeIcon, SparkleIcon } from "../Icons/Icons";
import styles from "./HeroHighlights.module.css";

function getCategoryIcon(text = "") {
  const s = text.toLowerCase();
  if (s.includes("chop")) return TrayIcon;
  if (s.includes("breakfast") || s.includes("box")) return BoxIcon;
  if (s.includes("cake")) return CakeIcon;
  return SparkleIcon;
}

export default function HeroHighlights() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAllCategories();
      setCategories(data.slice(0, 4));
      setLoading(false);
    }
    load();
  }, []);

  if (loading || categories.length === 0) return null;

  return (
    <div id="highlights" className={styles.wrapper}>
      <div className={styles.card}>
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.slug || cat.label);
          return (
            <Link key={cat.id} to={`/shop?category=${cat.slug}`} className={styles.item}>
              <Icon size={24} />
              <span className={styles.label}>{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}