import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const productsRef = collection(db, "products");

// Fetch all products (used by storefront + admin)
export async function getAllProducts() {
  const snapshot = await getDocs(query(productsRef, orderBy("name")));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Fetch products by category (used by storefront filters)
export async function getProductsByCategory(categoryId) {
  const q = query(productsRef, where("category", "==", categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Fetch single product (used by product detail page)
export async function getProductById(productId) {
  const docRef = doc(db, "products", productId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

// Create product (admin dashboard)
export async function createProduct(productData) {
  const docRef = await addDoc(productsRef, {
    ...productData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update product (admin dashboard — editing price, description, availability)
export async function updateProduct(productId, updates) {
  const docRef = doc(db, "products", productId);
  await updateDoc(docRef, updates);
}

// Delete product (admin dashboard)
export async function deleteProduct(productId) {
  const docRef = doc(db, "products", productId);
  await deleteDoc(docRef);
}