import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { getOptimizedUrl } from "../services/cloudinary";
import CustomizeWizard from "../components/Customize/CustomizeWizard";
import Skeleton from "../components/Skeleton/Skeleton";
import styles from "./ProductDetail.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.layout}>
          <Skeleton height="420px" radius="16px" />
          <div>
            <Skeleton height="30px" width="70%" style={{ marginBottom: "12px" }} />
            <Skeleton height="24px" width="40%" style={{ marginBottom: "20px" }} />
            <Skeleton height="16px" width="100%" style={{ marginBottom: "8px" }} />
            <Skeleton height="16px" width="90%" style={{ marginBottom: "24px" }} />
            <Skeleton height="48px" width="60%" radius="999px" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <p className={styles.status}>Product not found.</p>;

  const hasCustomization =
    product.isCustomizable &&
    (product.customizationGroups || []).some(
      (g) => g.enabled && g.options.some((o) => o.enabled)
    );

  return (
    <div className={styles.wrapper}>
      <Link to="/shop" className={styles.backLink}>← Back to Shop</Link>
      <div className={styles.layout}>
        <img
          src={getOptimizedUrl(product.images?.[0], { width: 800, height: 800 })}
          alt={product.name}
          className={styles.image}
        />
        <div className={styles.info}>
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>
            {hasCustomization ? "From " : ""}₦{Number(product.price).toLocaleString()}
          </p>
          <p className={styles.description}>{product.description}</p>

          {!product.available ? (
            <p className={styles.unavailableText}>Currently unavailable — check back soon.</p>
          ) : hasCustomization ? (
            <button className={styles.customizeBtn} onClick={() => setWizardOpen(true)}>
              Customize This Cake
            </button>
          ) : (
            <button
              className={styles.addBtn}
              onClick={() => {
                addToCart(product);
                showToast(`${product.name} added to cart`);
              }}
            >
              Add to Cart
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