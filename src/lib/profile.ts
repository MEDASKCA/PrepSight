import { ClinicalSetting, PlatformRole, PrepSightProfile, USER_ROLE_TO_PLATFORM_ROLE } from "./types"
import { getUserProfile, saveUserProfile } from "./firestore"

const STORAGE_KEY = "prepsight_profile"
export const PLATFORM_ROLE_COOKIE_KEY = "prepsight_platform_role"
const ROLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function resolvePlatformRole(profile: PrepSightProfile): PlatformRole {
  return profile.platformRole ?? USER_ROLE_TO_PLATFORM_ROLE[profile.role]
}

function setPlatformRoleCookie(role: PlatformRole): void {
  if (typeof document === "undefined") return
  document.cookie = `${PLATFORM_ROLE_COOKIE_KEY}=${role}; path=/; max-age=${ROLE_COOKIE_MAX_AGE}; samesite=lax`
}

function clearPlatformRoleCookie(): void {
  if (typeof document === "undefined") return
  document.cookie = `${PLATFORM_ROLE_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`
}

function normalizeProfile(profile: PrepSightProfile): PrepSightProfile {
  return {
    ...profile,
    platformRole: resolvePlatformRole(profile),
  }
}

export function getProfile(): PrepSightProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const profile = normalizeProfile(JSON.parse(raw) as PrepSightProfile)
    setPlatformRoleCookie(profile.platformRole!)
    return profile
  } catch {
    return null
  }
}

export function saveProfileLocal(profile: PrepSightProfile): void {
  if (typeof window === "undefined") return
  const normalized = normalizeProfile(profile)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
  setPlatformRoleCookie(normalized.platformRole!)
}

export function syncProfileRoleCookie(): void {
  const profile = getProfile()
  if (!profile) return
  setPlatformRoleCookie(profile.platformRole!)
}

export function clearProfile(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
  clearPlatformRoleCookie()
}

export function hasProfile(): boolean {
  return getProfile() !== null
}

export async function saveProfile(profile: PrepSightProfile, uid?: string): Promise<void> {
  const normalized = normalizeProfile(profile)
  saveProfileLocal(normalized)
  if (uid) saveUserProfile(uid, normalized)
}

export async function resolveProfile(uid: string): Promise<PrepSightProfile | null> {
  const local = getProfile()
  if (local) return local

  const remote = await getUserProfile(uid)
  if (remote) {
    const normalized = normalizeProfile(remote)
    saveProfileLocal(normalized)
    return normalized
  }

  return null
}

const DEPT_TO_SETTING: Record<string, ClinicalSetting> = {
  Theatres: "Operating Theatre",
  Endoscopy: "Endoscopy Suite",
  "ICU / Critical Care": "Intensive Care Unit",
  "Emergency Department": "Emergency Department",
  Ward: "Ward",
  "Clinic / Outpatients": "Outpatient / Clinic",
  Maternity: "Maternity & Obstetrics",
  "Interventional Radiology": "Interventional Radiology / Cath Lab",
}

export function getRelevantSettings(profile: PrepSightProfile): ClinicalSetting[] {
  return profile.departments
    .map((department) => DEPT_TO_SETTING[department])
    .filter(Boolean) as ClinicalSetting[]
}
