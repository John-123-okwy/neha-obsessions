import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getOptimizedUrl } from "../../services/cloudinary";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const rawImage = product.images?.[0] || product.image;
  const imageSrc = getOptimizedUrl(rawImage, { width: 500, height: 400 });

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageWrap}>
        <img src={imageSrc} alt={product.name} className={styles.image} />
      </Link>
      <div className={styles.body}>
        <Link to={`/product/${product.id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>₦{Number(product.price).toLocaleString()}</span>
          <button className={styles.addBtn} onClick={() => addToCart(product)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}