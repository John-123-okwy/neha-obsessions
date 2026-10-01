import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { getOptimizedUrl } from "../../services/cloudinary";
import CustomizeWizard from "../Customize/CustomizeWizard";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);

  const rawImage = product.images?.[0] || product.image;
  const imageSrc = getOptimizedUrl(rawImage, { width: 500, height: 400 });

  const hasCustomization =
    product.isCustomizable &&
    (product.customizationGroups || []).some(
      (g) => g.enabled && g.options.some((o) => o.enabled)
    );

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
          <span className={styles.price}>
            {hasCustomization ? "From " : ""}₦{Number(product.price).toLocaleString()}
          </span>
          {hasCustomization ? (
            <button
              className={styles.customizeBtn}
              onClick={() => !wizardOpen && setWizardOpen(true)}
            >
              Customize
            </button>
          ) : (
            <button
              className={styles.addBtn}
              onClick={() => {
                addToCart(product);
                showToast(`${product.name} added to cart`);
              }}
            >
              Add
            </button>
          )}
        </div>
      </div>

      {wizardOpen && (
        <CustomizeWizard product={product} onClose={() => setWizardOpen(false)} />
      )}
    </div>
  );
}