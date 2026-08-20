import { useEffect, useState } from "react";
import { getAllProducts } from "../services/products";
import { getAllCategories } from "../services/categories";

import ProductCardSkeleton from "../components/Skeleton/ProductCardSkeleton";
import CategoryStrip from "../components/CategoryStrip/CategoryStrip";
import ProductCard from "../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load shop data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  
const availableProducts = products.filter((p) => p.available);
  const filteredProducts = activeCategory
    ? availableProducts.filter((p) => p.category === activeCategory)
    : availableProducts;
  
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  

  return (
    <div>
      <CategoryStrip
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className={styles.grid}>
        {filteredProducts.length === 0 ? (
          <p className={styles.status}>
            No products here yet — check back soon!
          </p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
