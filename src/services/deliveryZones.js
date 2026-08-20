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

const zonesRef = collection(db, "deliveryZones");

export async function getAllDeliveryZones() {
  const snapshot = await getDocs(query(zonesRef, orderBy("name")));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createDeliveryZone(data) {
  const docRef = await addDoc(zonesRef, {
    ...data,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function updateDeliveryZone(id, updates) {
  await updateDoc(doc(db, "deliveryZones", id), updates);
}

export async function deleteDeliveryZone(id) {
  await deleteDoc(doc(db, "deliveryZones", id));
}