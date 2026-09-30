import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../services/products";
import ImageUploader from "./ImageUploader";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomizationGroupsEditor from "./CustomizationGroupsEditor";
import styles from "./ProductFormModal.module.css";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  description: "",
  images: [],
  available: true,
  isCustomizable: false,
  featured: false,
  customizationGroups: [],
  allowMessage: true,
  allowReferenceImage: true,
};

export default function ProductFormModal({ isOpen, onClose, editingProduct, categories, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        price: editingProduct.price || "",
        description: editingProduct.description || "",
        images: editingProduct.images || [],
        available: editingProduct.available ?? true,
        isCustomizable: editingProduct.isCustomizable || false,
        featured: editingProduct.featured || false,
        customizationGroups: editingProduct.customizationGroups || [],
        allowMessage: editingProduct.allowMessage ?? true,
        allowReferenceImage: editingProduct.allowReferenceImage ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError("");
  }, [editingProduct, isOpen]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || !form.category || !form.price || form.images.length === 0) {
      setError("Name, category, price, and a photo are all required.");
      return;
    }

    if (form.isCustomizable) {
      const invalidGroup = form.customizationGroups.find(
        (g) => !g.name.trim() || g.options.length === 0 || g.options.some((o) => !o.label.trim())
      );
      if (invalidGroup) {
        setError("Every customization group needs a name and every option needs a label.");
        return;
      }
    }

    setSaving(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price),
      customizationGroups: form.isCustomizable ? form.customizationGroups : [],
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
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
          {editingProduct ? "Edit Product" : "New Product"}
        </h2>

        <div className={styles.scrollArea}>
          <label className={styles.label}>
            Photo
            <ImageUploader
              imageUrl={form.images[0]}
              onUploaded={(url) => updateField("images", [url])}
            />
          </label>

          <label className={styles.label}>
            Product Name
            <input
              className={styles.input}
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. Deluxe Breakfast Box"
            />
          </label>

          <label className={styles.label}>
            Category
            <CustomSelect
              value={form.category}
              onChange={(val) => updateField("category", val)}
              placeholder="Select a category"
              options={categories.map((cat) => ({ value: cat.slug, label: cat.label }))}
            />
          </label>

          <label className={styles.label}>
            {form.isCustomizable ? "Base Price (₦)" : "Price (₦)"}
            <input
              className={styles.input}
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              placeholder="e.g. 4500"
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.textarea}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Short description shown to customers"
            />
          </label>

          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => updateField("available", e.target.checked)}
            />
            Available for purchase
          </label>

          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={form.isCustomizable}
              onChange={(e) => updateField("isCustomizable", e.target.checked)}
            />
            Customizable (e.g. custom cake)
          </label>

          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField("featured", e.target.checked)}
            />
            Show in "Featured This Week" on homepage
          </label>

          {form.isCustomizable && (
            <CustomizationGroupsEditor
              groups={form.customizationGroups}
              onChangeGroups={(groups) => updateField("customizationGroups", groups)}
              allowMessage={form.allowMessage}
              onChangeAllowMessage={(val) => updateField("allowMessage", val)}
              allowReferenceImage={form.allowReferenceImage}
              onChangeAllowReferenceImage={(val) => updateField("allowReferenceImage", val)}
            />
          )}

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}