import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { createCustomerProfile } from "../services/customers";
import AuthLayout from "../components/Auth/AuthLayout";
import PasswordInput from "../components/Auth/PasswordInput";
import styles from "./AuthForm.module.css";

const BENEFITS = [
  "Track your orders in real time",
  "View and download receipts",
  "Save your details for faster checkout",
  "Get exclusive offers and updates",
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(cred.user, { displayName: form.name });
      await createCustomerProfile(cred.user.uid, {
        name: form.name,
        email: form.email,
        phone: form.phone,
      });
      navigate("/home");
    } catch (err) {
      console.error("Signup failed:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        setError("Could not create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create Your Account" subtitle="Join us and make every celebration sweeter." benefits={BENEFITS}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.input} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input className={styles.input} type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
        <input className={styles.input} type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <PasswordInput name="password" placeholder="Create a password" value={form.password} onChange={handleChange} />
        <PasswordInput name="confirmPassword" placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange} />

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>I agree to the Terms of Service and Privacy Policy</span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.submitBtn} disabled={loading}>
          {loading ? "Creating Account…" : "Create Account"}
        </button>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign In</Link>
        </p>
      </form>
    </AuthLayout>
  );
}