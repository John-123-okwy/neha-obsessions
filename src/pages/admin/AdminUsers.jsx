import { useEffect, useState } from "react";
import { getAllAdmins, addAdmin, removeAdmin } from "../../services/admins";
import { useAuth } from "../../context/AuthContext";
import Skeleton from "../../components/Skeleton/Skeleton";
import styles from "./AdminUsers.module.css";

export default function AdminUsers() {
  const { currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [confirmRemoveEmail, setConfirmRemoveEmail] = useState(null);

  async function loadAdmins() {
    setLoading(true);
    const data = await getAllAdmins();
    setAdmins(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    const email = newEmail.trim().toLowerCase();
    if (!email) return;

    if (admins.some((a) => a.email === email)) {
      setError("This email is already an admin.");
      return;
    }

    setAdding(true);
    setError("");
    try {
      await addAdmin(email, currentUser?.email);
      setNewEmail("");
      loadAdmins();
    } catch (err) {
      console.error("Failed to add admin:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(email) {
    await removeAdmin(email);
    setConfirmRemoveEmail(null);
    loadAdmins();
  }

  return (
    <div>
      <h1 className={styles.title}>Admin Users</h1>
      <p className={styles.subtext}>
        Anyone added here can sign in and manage this dashboard. Make sure they already
        have an account created in Firebase Authentication first.
      </p>

      <form className={styles.addForm} onSubmit={handleAdd}>
        <input
          className={styles.input}
          type="email"
          placeholder="admin@example.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className={styles.addBtn} disabled={adding}>
          {adding ? "Adding…" : "Add Admin"}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <div className={styles.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="56px" radius="12px" />
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {admins.map((admin) => {
            const isSelf = admin.email === currentUser?.email?.toLowerCase();
            return (
              <div key={admin.id} className={styles.row}>
                <div>
                  <p className={styles.email}>{admin.email}</p>
                  {isSelf && <span className={styles.youBadge}>You</span>}
                </div>

                {isSelf ? (
                  <span className={styles.protectedText}>Cannot remove yourself</span>
                ) : confirmRemoveEmail === admin.email ? (
                  <div className={styles.confirmRow}>
                    <button className={styles.confirmYes} onClick={() => handleRemove(admin.email)}>Confirm</button>
                    <button className={styles.confirmNo} onClick={() => setConfirmRemoveEmail(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className={styles.removeBtn} onClick={() => setConfirmRemoveEmail(admin.email)}>
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}