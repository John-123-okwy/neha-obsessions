import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function createCustomerProfile(uid, data) {
  await setDoc(doc(db, "customers", uid), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}

export async function getCustomerProfile(uid) {
  const docSnap = await getDoc(doc(db, "customers", uid));
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateCustomerProfile(uid, updates) {
  await setDoc(doc(db, "customers", uid), updates, { merge: true });
}