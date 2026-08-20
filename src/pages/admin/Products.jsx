import { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../services/products";
import { getAllCategories } from "../../services/categories";
import ProductFormModal from "../../components/Admin/ProductFormModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import { getOptimizedUrl } from "../../services/cloudinary";
import styles from "./Products.module.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  async function loadData() {
    setLoading(true);
    const [productsData, categoriesData] = await Promise.all([
      getAllProducts(),
      getAllCategories(),
    ]);
    setProducts(productsData);
    setCategories(categoriesData);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function categoryLabel(slug) {
    return categories.find((c) => c.slug === slug)?.label || slug;
  }

  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    await deleteProduct(id);
    setConfirmDeleteId(null);
    loadData();
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height="220px" radius="16px" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className={styles.empty}>No products yet — add your first one.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div className={styles.imageWrap}>
                <img
                  src={getOptimizedUrl(product.images?.[0], { width: 300, height: 220 })}
                  alt={product.name}
                  className={styles.image}
                />
              
              {!product.available && (
                  <span className={styles.unavailableBadge}>Unavailable</span>
                )}
                {product.featured && (
                  <span className={styles.featuredBadge}>Featured</span>
                )}
              
              </div>

              <div className={styles.cardBody}>
                <p className={styles.category}>{categoryLabel(product.category)}</p>
                <p className={styles.name}>{product.name}</p>
                <p className={styles.price}>₦{Number(product.price).toLocaleString()}</p>
              </div>

              <div className={styles.cardActions}>
                {confirmDeleteId === product.id ? (
                  <div className={styles.confirmRow}>
                    <button
                      className={styles.confirmYes}
                      onClick={() => handleDelete(product.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className={styles.confirmNo}
                      onClick={() => setConfirmDeleteId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className={styles.editBtn}
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setConfirmDeleteId(product.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingProduct={editingProduct}
        categories={categories}
        onSaved={loadData}
      />
    </div>
  );
}