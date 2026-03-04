import { auth } from "./firebase"
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

const googleProvider    = new GoogleAuthProvider()
const microsoftProvider = new OAuthProvider("microsoft.com")
microsoftProvider.setCustomParameters({ prompt: "select_account" })

function isMobile() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured")
  if (isMobile()) return signInWithRedirect(auth, googleProvider)
  try {
    return await signInWithPopup(auth, googleProvider)
  } catch (e: unknown) {
    const code = (e as { code?: string }).code ?? ""
    if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user") {
      return signInWithRedirect(auth, googleProvider)
    }
    throw e
  }
}

export async function signInWithMicrosoft() {
  if (!auth) throw new Error("Firebase not configured")
  if (isMobile()) return signInWithRedirect(auth, microsoftProvider)
  try {
    return await signInWithPopup(auth, microsoftProvider)
  } catch (e: unknown) {
    const code = (e as { code?: string }).code ?? ""
    if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user") {
      return signInWithRedirect(auth, microsoftProvider)
    }
    throw e
  }
}

export async function getLoginRedirectResult() {
  if (!auth) return null
  return getRedirectResult(auth)
}

export async function signOut() {
  if (!auth) return
  return firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    // No Firebase credentials — treat as not signed in
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export type { User }
