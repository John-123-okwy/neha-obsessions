import { useState, useEffect } from "react";
import { createDeliveryZone, updateDeliveryZone } from "../../services/deliveryZones";
import styles from "./DeliveryZoneFormModal.module.css";

export default function DeliveryZoneFormModal({ isOpen, onClose, editingZone, onSaved }) {
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingZone) {
      setName(editingZone.name);
      setFee(String(editingZone.fee));
      setActive(editingZone.active ?? true);
    } else {
      setName("");
      setFee("");
      setActive(true);
    }
    setError("");
  }, [editingZone, isOpen]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || fee === "") {
      setError("Please provide a zone name and delivery fee.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { name: name.trim(), fee: Number(fee), active };
      if (editingZone) {
        await updateDeliveryZone(editingZone.id, payload);
      } else {
        await createDeliveryZone(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to save delivery zone:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <form className={styles.sheet} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className={styles.handle} />
        <h2 className={styles.title}>{editingZone ? "Edit Delivery Zone" : "New Delivery Zone"}</h2>

        <label className={styles.label}>
          Zone Name
          <input
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ikeja"
            autoFocus
          />
        </label>

        <label className={styles.label}>
          Delivery Fee (₦)
          <input
            className={styles.input}
            type="number"
            min="0"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            placeholder="e.g. 1500"
          />
        </label>

        <label className={styles.toggleRow}>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Active (visible to customers at checkout)
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}