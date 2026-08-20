import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const categoriesRef = collection(db, "categories");

// Fetch all categories (used by storefront nav/filters + admin dashboard)
export async function getAllCategories() {
  const snapshot = await getDocs(query(categoriesRef, orderBy("order")));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// Create category (admin dashboard)
export async function createCategory(categoryData) {
  const docRef = await addDoc(categoriesRef, {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update category — e.g. rename, reorder (admin dashboard)
export async function updateCategory(categoryId, updates) {
  const docRef = doc(db, "categories", categoryId);
  await updateDoc(docRef, updates);
}

// Delete category (admin dashboard)
export async function deleteCategory(categoryId) {
  const docRef = doc(db, "categories", categoryId);
  await deleteDoc(docRef);
}