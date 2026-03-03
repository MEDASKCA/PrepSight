import { PrepSightProfile, ClinicalSetting } from "./types"
import { getUserProfile, saveUserProfile } from "./firestore"

const STORAGE_KEY = "prepsight_profile"

// ── Local (localStorage) ────────────────────────────────────────────────────

export function getProfile(): PrepSightProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PrepSightProfile) : null
  } catch {
    return null
  }
}

export function saveProfileLocal(profile: PrepSightProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearProfile(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function hasProfile(): boolean {
  return getProfile() !== null
}

// ── Dual-write (Firestore + localStorage) ───────────────────────────────────

/** Save profile to both Firestore and localStorage. uid optional — skips Firestore if absent. */
export async function saveProfile(profile: PrepSightProfile, uid?: string): Promise<void> {
  saveProfileLocal(profile)
  if (uid) await saveUserProfile(uid, profile)
}

/**
 * Check for profile: localStorage first (fast), then Firestore fallback.
 * If found in Firestore but not localStorage, saves to localStorage.
 */
export async function resolveProfile(uid: string): Promise<PrepSightProfile | null> {
  const local = getProfile()
  if (local) return local

  const remote = await getUserProfile(uid)
  if (remote) {
    saveProfileLocal(remote)
    return remote
  }

  return null
}

// ── Content filtering ────────────────────────────────────────────────────────

const DEPT_TO_SETTING: Record<string, ClinicalSetting> = {
  "Theatres":                "Operating Theatre",
  "Endoscopy":               "Endoscopy Suite",
  "ICU / Critical Care":     "Intensive Care Unit",
  "Emergency Department":    "Emergency Department",
  "Ward":                    "Ward",
  "Clinic / Outpatients":    "Outpatient / Clinic",
  "Maternity":               "Maternity & Obstetrics",
  "Interventional Radiology":"Interventional Radiology / Cath Lab",
}

export function getRelevantSettings(profile: PrepSightProfile): ClinicalSetting[] {
  return profile.departments
    .map((d) => DEPT_TO_SETTING[d])
    .filter(Boolean) as ClinicalSetting[]
}
