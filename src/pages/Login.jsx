import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import AuthLayout from "../components/Auth/AuthLayout";
import PasswordInput from "../components/Auth/PasswordInput";
import styles from "./AuthForm.module.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate(redirectTo);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then tap 'Forgot Password?'");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setError("");
      setNotice("Password reset email sent — check your inbox.");
    } catch (err) {
      console.error("Reset email failed:", err);
      setError("Could not send reset email. Check the address and try again.");
    }
  }

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue to your account">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="button" className={styles.forgotLink} onClick={handleForgotPassword}>
          Forgot Password?
        </button>

        {error && <p className={styles.error}>{error}</p>}
        {notice && <p className={styles.notice}>{notice}</p>}

        <button className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing In…" : "Log In"}
        </button>

        <p className={styles.switchText}>
          Don't have an account? <Link to="/signup" className={styles.switchLink}>Sign Up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}