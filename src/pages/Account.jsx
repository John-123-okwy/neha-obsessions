import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { updateCustomerProfile } from "../services/customers";
import { getOrdersByCustomerId } from "../services/orders";
import OrderCard from "../components/OrdersHistory/OrderCard";
import PasswordInput from "../components/Auth/PasswordInput";
import Skeleton from "../components/Skeleton/Skeleton";
import styles from "./Account.module.css";

export default function Account() {
  const { currentUser, customerProfile, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (customerProfile) {
      setForm({
        name: customerProfile.name || "",
        phone: customerProfile.phone || "",
        address: customerProfile.address || "",
      });
    }
  }, [customerProfile]);

  useEffect(() => {
    async function loadOrders() {
      if (!currentUser) return;
      const data = await getOrdersByCustomerId(currentUser.uid);
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setOrdersLoading(false);
    }
    loadOrders();
  }, [currentUser]);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCustomerProfile(currentUser.uid, form);
      await refreshProfile();
      showToast("Profile updated");
    } catch (err) {
      console.error("Failed to save profile:", err);
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordError("");

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setPasswordError("Please fill in all password fields.");
      return;
    }
    if (passwordForm.next.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setPasswordSaving(true);
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwordForm.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordForm.next);
      setPasswordForm({ current: "", next: "", confirm: "" });
      showToast("Password updated");
    } catch (err) {
      console.error("Password change failed:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPasswordError("Current password is incorrect.");
      } else {
        setPasswordError("Could not update password. Please try again.");
      }
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>My Account</h1>
      <p className={styles.email}>{currentUser?.email}</p>

      <form className={styles.card} onSubmit={handleSaveProfile}>
        <h2 className={styles.cardTitle}>Profile Details</h2>
        <label className={styles.label}>
          Full Name
          <input
            className={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Phone
          <input
            className={styles.input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Default Delivery Address
          <textarea
            className={styles.textarea}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </label>
        <button className={styles.saveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <form className={styles.card} onSubmit={handleChangePassword}>
        <h2 className={styles.cardTitle}>Change Password</h2>
        <label className={styles.label}>
          Current Password
          <PasswordInput
            placeholder="Enter current password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          New Password
          <PasswordInput
            placeholder="At least 6 characters"
            value={passwordForm.next}
            onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
          />
        </label>
        <label className={styles.label}>
          Confirm New Password
          <PasswordInput
            placeholder="Re-enter new password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
          />
        </label>

        {passwordError && <p className={styles.errorText}>{passwordError}</p>}

        <button className={styles.saveBtn} disabled={passwordSaving}>
          {passwordSaving ? "Updating…" : "Update Password"}
        </button>
      </form>

      <h2 className={styles.sectionTitle}>Order History</h2>
      {ordersLoading ? (
        <Skeleton height="200px" radius="16px" />
      ) : orders.length === 0 ? (
        <p className={styles.emptyText}>No orders yet.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
}