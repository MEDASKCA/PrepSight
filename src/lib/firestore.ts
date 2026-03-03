import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { PrepSightProfile } from "./types"

export async function getUserProfile(uid: string): Promise<PrepSightProfile | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, "users", uid))
    return snap.exists() ? (snap.data() as PrepSightProfile) : null
  } catch (err) {
    console.warn("[PrepSight] Firestore getUserProfile failed:", err)
    return null
  }
}

export async function saveUserProfile(uid: string, profile: PrepSightProfile): Promise<void> {
  if (!db) return
  try {
    await setDoc(doc(db, "users", uid), profile)
  } catch (err) {
    console.warn("[PrepSight] Firestore saveUserProfile failed:", err)
  }
}

export async function hasUserProfile(uid: string): Promise<boolean> {
  const p = await getUserProfile(uid)
  return p !== null
}
