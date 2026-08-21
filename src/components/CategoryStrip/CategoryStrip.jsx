import styles from "./CategoryStrip.module.css";

export default function CategoryStrip({ categories = [], activeCategory, onSelect }) {
  return (
    <section id="categories" className={styles.wrapper}>
      <div className={styles.row}>
        <button
          className={`${styles.pill} ${!activeCategory ? styles.pillActive : ""}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.pill} ${activeCategory === cat.slug ? styles.pillActive : ""}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}