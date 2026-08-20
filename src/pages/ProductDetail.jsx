import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/products";
import styles from "./ProductDetail.module.css";


import { getOptimizedUrl } from "../services/cloudinary";

import Skeleton from "../components/Skeleton/Skeleton";
export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <Skeleton height="400px" radius="16px" />
          <div>
            <Skeleton height="28px" width="70%" style={{ marginBottom: "12px" }} />
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
          <p className={styles.price}>₦{Number(product.price).toLocaleString()}</p>
          <p className={styles.description}>{product.description}</p>
          
         {product.available ? (
            <button className={styles.addBtn} onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          ) : (
            <p className={styles.unavailableText}>
              Currently unavailable — check back soon.
            </p>
          )}
          
        </div>
      </div>
    </div>
  );
}