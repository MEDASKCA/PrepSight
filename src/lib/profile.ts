import { PrepSightProfile } from "./types"

const STORAGE_KEY = "prepsight_profile"

export function getProfile(): PrepSightProfile | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as PrepSightProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: PrepSightProfile): void {
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
