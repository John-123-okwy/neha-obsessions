import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

const adminsRef = collection(db, "admins");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

// Checks if a given email is in the admins collection
export async function isUserAdmin(email) {
  if (!email) return false;
  const docRef = doc(db, "admins", normalizeEmail(email));
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function getAllAdmins() {
  const snapshot = await getDocs(query(adminsRef, orderBy("addedAt", "desc")));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addAdmin(email, addedByEmail) {
  const normalized = normalizeEmail(email);
  await setDoc(doc(db, "admins", normalized), {
    email: normalized,
    addedAt: new Date().toISOString(),
    addedBy: addedByEmail || null,
  });
}

export async function removeAdmin(email) {
  await deleteDoc(doc(db, "admins", normalizeEmail(email)));
}