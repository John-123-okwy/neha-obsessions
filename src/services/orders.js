
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  getDocs,
  where,limit,
  onSnapshot,
} from "firebase/firestore";


import { db } from "./firebase";
import { ORDER_STATUS } from "../utils/constants";

const ordersRef = collection(db, "orders");

// Create order after payment is verified (checkout flow)
export async function createOrder(orderData) {
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    status: ORDER_STATUS.CONFIRMED,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Fetch single order (order confirmation / tracking page)
export async function getOrderById(orderId) {
  const docRef = doc(db, "orders", orderId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

//

// Live-subscribe to a single order (order tracking page)
// Returns an unsubscribe function — call it when the component unmounts
export function subscribeToOrder(orderId, callback) {
  const docRef = doc(db, "orders", orderId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
}

// Fetch all orders (admin dashboard, built later)
export async function getAllOrders() {
  const snapshot = await getDocs(query(ordersRef, orderBy("createdAt", "desc")));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

// Update order status (admin dashboard, built later)
export async function updateOrderStatus(orderId, status) {
  const docRef = doc(db, "orders", orderId);
  await updateDoc(docRef, { status });
}



// Live-subscribe to ALL orders, newest first (admin orders dashboard)
export function subscribeToAllOrders(callback) {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    callback(orders);
  });
}

// Checks if an order already exists for a given payment reference —
// used to avoid creating a duplicate order during recovery/retry.
export async function getOrderByReference(reference) {
  const q = query(ordersRef, where("paymentReference", "==", reference), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() };
}

//////////
export async function getOrdersByCustomerId(customerId) {
  const q = query(ordersRef, where("customerId", "==", customerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}