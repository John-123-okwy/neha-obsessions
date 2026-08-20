import { useEffect, useState } from "react";
import { getAllDeliveryZones, deleteDeliveryZone } from "../../services/deliveryZones";
import DeliveryZoneFormModal from "../../components/Admin/DeliveryZoneFormModal";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./DeliveryZones.module.css";

export default function DeliveryZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  async function loadZones() {
    setLoading(true);
    const data = await getAllDeliveryZones();
    setZones(data);
    setLoading(false);
  }

  useEffect(() => {
    loadZones();
  }, []);

  function openAddModal() {
    setEditingZone(null);
    setModalOpen(true);
  }

  function openEditModal(zone) {
    setEditingZone(zone);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    await deleteDeliveryZone(id);
    setConfirmDeleteId(null);
    loadZones();
  }

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Delivery Zones</h1>
        <button className={styles.addBtn} onClick={openAddModal}>+ Add Zone</button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="80px" radius="16px" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <p className={styles.empty}>No delivery zones yet — add your first one.</p>
      ) : (
        <div className={styles.grid}>
          {zones.map((zone) => (
            <div key={zone.id} className={styles.card}>
              <div className={styles.cardBody}>
                <p className={styles.name}>{zone.name}</p>
                <p className={styles.fee}>₦{Number(zone.fee).toLocaleString()}</p>
              </div>
              <span className={`${styles.statusBadge} ${zone.active ? styles.statusActive : styles.statusInactive}`}>
                {zone.active ? "Active" : "Inactive"}
              </span>
              <div className={styles.cardActions}>
                {confirmDeleteId === zone.id ? (
                  <div className={styles.confirmRow}>
                    <button className={styles.confirmYes} onClick={() => handleDelete(zone.id)}>Confirm</button>
                    <button className={styles.confirmNo} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <button className={styles.editBtn} onClick={() => openEditModal(zone)}>Edit</button>
                    <button className={styles.deleteBtn} onClick={() => setConfirmDeleteId(zone.id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DeliveryZoneFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingZone={editingZone}
        onSaved={loadZones}
      />
    </div>
  );
}