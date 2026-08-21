import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const categoriesRef = collection(db, "categories");

export async function getAllCategories() {
  const snapshot = await getDocs(categoriesRef);
  const categories = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
  return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function createCategory(categoryData) {
  const docRef = await addDoc(categoriesRef, {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateCategory(categoryId, updates) {
  await updateDoc(doc(db, "categories", categoryId), updates);
}

export async function deleteCategory(categoryId) {
  await deleteDoc(doc(db, "categories", categoryId));
}