import { useState, useEffect } from "react";
import { createCategory, updateCategory } from "../../services/categories";
import { slugify } from "../../utils/slugify";
import styles from "./CategoryFormModal.module.css";

export default function CategoryFormModal({ isOpen, onClose, editingCategory, onSaved, nextOrder }) {
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCategory) {
      setLabel(editingCategory.label);
      setSlug(editingCategory.slug);
      setSlugTouched(true);
    } else {
      setLabel("");
      setSlug("");
      setSlugTouched(false);
    }
    setError("");
  }, [editingCategory, isOpen]);

  function handleLabelChange(value) {
    setLabel(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!label.trim() || !slug.trim()) {
      setError("Both name and slug are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { label, slug });
      } else {
        await createCategory({ label, slug, order: nextOrder });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save category:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className={styles.handle} />
        <h2 className={styles.title}>
          {editingCategory ? "Edit Category" : "New Category"}
        </h2>

        <label className={styles.label}>
          Name
          <input
            className={styles.input}
            value={label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="e.g. Small Chops"
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Slug
          <input
            className={styles.input}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="small-chops"
          />
        </label>
        <p className={styles.hint}>
          Used internally to link products — lowercase, no spaces.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}