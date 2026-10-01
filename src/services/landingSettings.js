import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const DOC_REF = doc(db, "siteSettings", "landing");

const DEFAULTS = { heroSlides: [], stats: [] };

export async function getLandingSettings() {
  const snap = await getDoc(DOC_REF);
  return snap.exists() ? { ...DEFAULTS, ...snap.data() } : DEFAULTS;
}

export async function updateLandingSettings(updates) {
  await setDoc(DOC_REF, updates, { merge: true });
}