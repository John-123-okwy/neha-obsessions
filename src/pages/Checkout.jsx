import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, getOrderByReference } from "../services/orders";
import { getAllDeliveryZones } from "../services/deliveryZones";
import { retryAsync } from "../utils/retry";
import CustomSelect from "../components/CustomSelect/CustomSelect";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
import styles from "./Checkout.module.css";

const PENDING_KEY = "neha-obsessions-pending-payment";

export default function Checkout() {
  const { items, totalPrice: subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [zones, setZones] = useState([]);
  const [zonesLoading, setZonesLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    deliveryMethod: "delivery",
    zoneId: "",
  });

  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [unresolved, setUnresolved] = useState(null);
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);

  useEffect(() => {
    async function loadZones() {
      const data = await getAllDeliveryZones();
      setZones(data.filter((z) => z.active));
      setZonesLoading(false);
    }
    loadZones();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(PENDING_KEY);
    if (saved) {
      const snapshot = JSON.parse(saved);
      setProcessing(true);
      setStatusMessage("Finishing your last payment…");
      attemptCompleteOrder(snapshot.reference, snapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const selectedZone = zones.find((z) => z.id === form.zoneId);
  const deliveryFee = form.deliveryMethod === "delivery" ? (selectedZone?.fee || 0) : 0;
  const grandTotal = subtotal + deliveryFee;

  function isFormValid() {
    if (!form.name || !form.email || !form.phone) return false;
    if (form.deliveryMethod === "delivery") {
      return Boolean(form.address && form.zoneId);
    }
    return true;
  }

  async function verifyReference(reference) {
    const res = await fetch("/api/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    });
    if (!res.ok) throw new Error("Verification request failed");
    return res.json();
  }

  const attemptCompleteOrder = useCallback(async (reference, snapshot) => {
    setError("");
    setUnresolved(null);

    try {
      const result = await retryAsync(() => verifyReference(reference), {
        retries: 4,
        delayMs: 2000,
        onAttempt: (attempt) =>
          setStatusMessage(`Confirming your payment… (attempt ${attempt}/4)`),
      });

      if (!result.verified) {
        localStorage.removeItem(PENDING_KEY);
        setError("Payment was not successful. You have not been charged.");
        setProcessing(false);
        setStatusMessage("");
        return;
      }

      const existing = await getOrderByReference(reference);
      let orderId = existing?.id;

      if (!orderId) {
        orderId = await createOrder({
          customer: snapshot.customer,
          deliveryMethod: snapshot.deliveryMethod,
          address: snapshot.address,
          deliveryZone: snapshot.deliveryZone,
          items: snapshot.items,
          subtotal: snapshot.subtotal,
          deliveryFee: snapshot.deliveryFee,
          totalPrice: snapshot.totalPrice,
          paymentReference: reference,
        });
      }

      localStorage.removeItem(PENDING_KEY);
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error("Could not confirm payment after retries:", err);
      setProcessing(false);
      setStatusMessage("");
      setUnresolved(snapshot);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCart, navigate]);

  function handlePayment() {
    if (!isFormValid()) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setProcessing(true);
    setStatusMessage("Waiting for payment…");
    setShowRedirectOverlay(true);

    // Simple, reliable safety timer — hides the bridge overlay shortly
    // after Paystack's own popup has had time to take over the screen.
    const overlayTimer = setTimeout(() => setShowRedirectOverlay(false), 1200);

    let handler;
    try {
      handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: Math.round(grandTotal * 100),
        currency: "NGN",
        callback: (response) => {
          clearTimeout(overlayTimer);
          setShowRedirectOverlay(false);
          const snapshot = {
            reference: response.reference,
            customer: { name: form.name, email: form.email, phone: form.phone },
            deliveryMethod: form.deliveryMethod,
            address: form.deliveryMethod === "delivery" ? form.address : null,
            deliveryZone: selectedZone ? { name: selectedZone.name, fee: selectedZone.fee } : null,
            items,
            subtotal,
            deliveryFee,
            totalPrice: grandTotal,
          };
          localStorage.setItem(PENDING_KEY, JSON.stringify(snapshot));
          setStatusMessage("Payment received — confirming…");
          attemptCompleteOrder(response.reference, snapshot);
        },
        onClose: () => {
          clearTimeout(overlayTimer);
          setShowRedirectOverlay(false);
          setProcessing(false);
          setStatusMessage("");
        },
      });
      handler.openIframe();
    } catch (err) {
      console.error("Failed to open Paystack:", err);
      clearTimeout(overlayTimer);
      setShowRedirectOverlay(false);
      setProcessing(false);
      setError("Could not start payment. Please refresh and try again.");
    }
  }

  if (items.length === 0 && !unresolved && !processing) {
    return <p className={styles.status}>Your cart is empty.</p>;
  }

  if (unresolved) {
    const whatsappMsg = encodeURIComponent(
      `Hi, I made a payment (ref: ${unresolved.reference}) but the app couldn't confirm it. Please check my order.`
    );
    return (
      <div className={styles.wrapper}>
        <div className={styles.unresolvedCard}>
          <h2 className={styles.unresolvedTitle}>We're still confirming your payment</h2>
          <p className={styles.unresolvedText}>
            If you were charged, your payment reference is safely saved and nothing is lost.
            This usually means a slow or dropped connection — try again below.
          </p>
          <p className={styles.refCode}>Ref: {unresolved.reference}</p>
          <button
            className={styles.retryBtn}
            onClick={() => {
              setProcessing(true);
              attemptCompleteOrder(unresolved.reference, unresolved);
            }}
          >
            Retry Confirmation
          </button>
          <a
            className={styles.whatsappLink}
            href={`https://wa.me/2349019938875?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us on WhatsApp instead
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {showRedirectOverlay && (
        <LoadingOverlay message="Redirecting you to a secure payment window…" />
      )}

      <div className={styles.wrapper}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.formSection}>
            <label className={styles.label}>
              Full Name *
              <input className={styles.input} name="name" value={form.name} onChange={handleChange} />
            </label>

            <label className={styles.label}>
              Email *
              <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} />
            </label>

            <label className={styles.label}>
              Phone *
              <input className={styles.input} name="phone" value={form.phone} onChange={handleChange} />
            </label>

            <label className={styles.label}>
              Delivery Method
              <CustomSelect
                value={form.deliveryMethod}
                onChange={(val) => setForm((prev) => ({ ...prev, deliveryMethod: val }))}
                options={[
                  { value: "delivery", label: "Delivery" },
                  { value: "pickup", label: "Pickup" },
                ]}
              />
            </label>

            {form.deliveryMethod === "delivery" && (
              <>
                <label className={styles.label}>
                  Delivery Zone *
                  <CustomSelect
                    value={form.zoneId}
                    onChange={(val) => setForm((prev) => ({ ...prev, zoneId: val }))}
                    placeholder={zonesLoading ? "Loading zones…" : "Select your area"}
                    options={zones.map((zone) => ({
                      value: zone.id,
                      label: `${zone.name} — ₦${zone.fee.toLocaleString()}`,
                    }))}
                  />
                </label>

                <label className={styles.label}>
                  Delivery Address *
                  <textarea className={styles.textarea} name="address" value={form.address} onChange={handleChange} />
                </label>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
          </div>

          <div className={styles.summarySection}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            {items.map((item) => (
              <div key={item.id} className={styles.summaryRow}>
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div className={styles.summaryDivider} />

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>

            {form.deliveryMethod === "pickup" ? (
              <div className={styles.summaryRow}>
                <span>Method</span>
                <span>Pickup</span>
              </div>
            ) : (
              <div className={styles.summaryRow}>
                <span>Delivery Fee {selectedZone ? `(${selectedZone.name})` : ""}</span>
                <span>{selectedZone ? `₦${deliveryFee.toLocaleString()}` : "Select a zone"}</span>
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₦{grandTotal.toLocaleString()}</span>
            </div>

            {statusMessage && <p className={styles.statusMessage}>{statusMessage}</p>}

            <button className={styles.payBtn} onClick={handlePayment} disabled={processing}>
              {processing ? "Processing…" : `Pay ₦${grandTotal.toLocaleString()}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}