import { useEffect, useState } from "react";
import { getAllCategories, deleteCategory, updateCategory } from "../../services/categories";
import CategoryFormModal from "../../components/Admin/CategoryFormModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./Categories.module.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  async function loadCategories() {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function openAddModal() {
    setEditingCategory(null);
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    await deleteCategory(id);
    setConfirmDeleteId(null);
    loadCategories();
  }

  async function moveCategory(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const current = categories[index];
    const target = categories[targetIndex];

    await Promise.all([
      updateCategory(current.id, { order: target.order }),
      updateCategory(target.id, { order: current.order }),
    ]);

    loadCategories();
  }

  const nextOrder = categories.length
    ? Math.max(...categories.map((c) => c.order || 0)) + 1
    : 1;

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="90px" radius="16px" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className={styles.empty}>No categories yet — add your first one.</p>
      ) : (
        <div className={styles.grid}>
          {categories.map((category, index) => (
            <div key={category.id} className={styles.card}>
              <div className={styles.orderControls}>
                <button
                  onClick={() => moveCategory(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveCategory(index, 1)}
                  disabled={index === categories.length - 1}
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.label}>{category.label}</p>
                <p className={styles.slug}>/{category.slug}</p>
              </div>

              <div className={styles.cardActions}>
                {confirmDeleteId === category.id ? (
                  <div className={styles.confirmRow}>
                    <button
                      className={styles.confirmYes}
                      onClick={() => handleDelete(category.id)}
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
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setConfirmDeleteId(category.id)}
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

      <CategoryFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingCategory={editingCategory}
        onSaved={loadCategories}
        nextOrder={nextOrder}
      />
    </div>
  );
}