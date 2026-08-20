import styles from "./CategoryStrip.module.css";

export default function CategoryStrip({ categories =[], activeCategory, onSelect }) {
  return (
    <section id="categories" className={styles.wrapper}>
      <h2 className={styles.title}>Shop by Category</h2>
      <div className={styles.row}>
        <button
          className={`${styles.ticket} ${!activeCategory ? styles.ticketActive : ""}`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.ticket} ${activeCategory === cat.slug ? styles.ticketActive : ""}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </section>
  );
}