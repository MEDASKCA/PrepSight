import {
  doc, getDoc, setDoc, deleteDoc,
  collection, getDocs,
} from "firebase/firestore"
import { db } from "./firebase"
import { ChecklistEntry, PrepSightProfile, Section } from "./types"

// ── User profile ──────────────────────────────────────────────────────────────

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

// ── Admin content ─────────────────────────────────────────────────────────────
// Stored in admin_content/{key} — dots in key replaced with underscores as doc ID

function contentDocId(key: string) {
  return key.replace(/\./g, "_")
}

export async function getAllAdminContent(): Promise<Record<string, string>> {
  if (!db) return {}
  try {
    const snap = await getDocs(collection(db, "admin_content"))
    const result: Record<string, string> = {}
    snap.forEach((d) => {
      // Convert doc ID back to dotted key
      result[d.id.replace(/_/g, ".")] = d.data().value as string
    })
    return result
  } catch {
    return {}
  }
}

export async function saveAdminContent(uid: string, key: string, value: string): Promise<void> {
  if (!db) return
  await setDoc(doc(db, "admin_content", contentDocId(key)), {
    value,
    updatedAt: new Date().toISOString(),
    updatedBy: uid,
  })
}

export async function deleteAdminContent(key: string): Promise<void> {
  if (!db) return
  await deleteDoc(doc(db, "admin_content", contentDocId(key)))
}

// ── Hospitals (Firestore additions on top of seed JSON) ───────────────────────

export interface FirestoreHospital {
  id: string
  name: string
  trust?: string
  addedAt: string
  addedBy: string
  approved: boolean
  approvedAt?: string
  approvedBy?: string
}

export async function getFirestoreHospitals(): Promise<FirestoreHospital[]> {
  if (!db) return []
  try {
    const snap = await getDocs(collection(db, "hospitals"))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreHospital))
  } catch {
    return []
  }
}

export async function addFirestoreHospital(
  uid: string,
  name: string,
  trust?: string,
): Promise<void> {
  if (!db) return
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  await setDoc(doc(db, "hospitals", id), {
    name,
    trust: trust ?? "",
    addedAt: new Date().toISOString(),
    addedBy: uid,
    approved: false,
  })
}

export async function approveFirestoreHospital(uid: string, id: string): Promise<void> {
  if (!db) return
  const ref = doc(db, "hospitals", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  await setDoc(ref, { ...snap.data(), approved: true, approvedAt: new Date().toISOString(), approvedBy: uid })
}

export async function deleteFirestoreHospital(id: string): Promise<void> {
  if (!db) return
  await deleteDoc(doc(db, "hospitals", id))
}

// ── Surgeons (Firestore) ──────────────────────────────────────────────────────

export interface FirestoreSurgeon {
  id: string
  name: string
  shortName: string
  specialty: string
  grade?: string
  addedAt: string
  addedBy: string
  approved: boolean
}

export async function getFirestoreSurgeons(): Promise<FirestoreSurgeon[]> {
  if (!db) return []
  try {
    const snap = await getDocs(collection(db, "surgeons"))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FirestoreSurgeon))
  } catch {
    return []
  }
}

export async function addFirestoreSurgeon(
  uid: string,
  surgeon: Omit<FirestoreSurgeon, "id" | "addedAt" | "addedBy" | "approved">,
): Promise<void> {
  if (!db) return
  const id = surgeon.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  await setDoc(doc(db, "surgeons", id), {
    ...surgeon,
    addedAt: new Date().toISOString(),
    addedBy: uid,
    approved: false,
  })
}

export async function approveFirestoreSurgeon(uid: string, id: string): Promise<void> {
  if (!db) return
  const ref = doc(db, "surgeons", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  await setDoc(ref, { ...snap.data(), approved: true, approvedAt: new Date().toISOString(), approvedBy: uid })
}

export async function deleteFirestoreSurgeon(id: string): Promise<void> {
  if (!db) return
  await deleteDoc(doc(db, "surgeons", id))
}

// Card checklist state (mutable, user/hospital specific)

function checklistDocId(uid: string, cardKey: string) {
  return `${uid}__${cardKey.replace(/[^a-z0-9_-]+/gi, "-")}`
}

export async function getCardChecklist(
  uid: string,
  cardKey: string,
): Promise<ChecklistEntry[]> {
  if (!db) return []
  try {
    const snap = await getDoc(doc(db, "card_checklists", checklistDocId(uid, cardKey)))
    if (!snap.exists()) return []
    const entries = snap.data().entries
    return Array.isArray(entries) ? (entries as ChecklistEntry[]) : []
  } catch (err) {
    console.warn("[PrepSight] Firestore getCardChecklist failed:", err)
    return []
  }
}

export async function saveCardChecklist(
  uid: string,
  cardKey: string,
  entries: ChecklistEntry[],
): Promise<void> {
  if (!db) return
  try {
    await setDoc(doc(db, "card_checklists", checklistDocId(uid, cardKey)), {
      entries,
      updatedAt: new Date().toISOString(),
      updatedBy: uid,
    })
  } catch (err) {
    console.warn("[PrepSight] Firestore saveCardChecklist failed:", err)
  }
}

export async function getCardCustomSections(
  uid: string,
  cardKey: string,
): Promise<Section[]> {
  if (!db) return []
  try {
    const snap = await getDoc(doc(db, "card_custom_sections", checklistDocId(uid, cardKey)))
    if (!snap.exists()) return []
    const sections = snap.data().sections
    return Array.isArray(sections) ? (sections as Section[]) : []
  } catch (err) {
    console.warn("[PrepSight] Firestore getCardCustomSections failed:", err)
    return []
  }
}

export async function saveCardCustomSections(
  uid: string,
  cardKey: string,
  sections: Section[],
): Promise<void> {
  if (!db) return
  try {
    await setDoc(doc(db, "card_custom_sections", checklistDocId(uid, cardKey)), {
      sections,
      updatedAt: new Date().toISOString(),
      updatedBy: uid,
    })
  } catch (err) {
    console.warn("[PrepSight] Firestore saveCardCustomSections failed:", err)
  }
}
