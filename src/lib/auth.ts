import { auth } from "./firebase"
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"

const googleProvider    = new GoogleAuthProvider()
const microsoftProvider = new OAuthProvider("microsoft.com")
microsoftProvider.setCustomParameters({ prompt: "select_account" })

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured")
  return signInWithPopup(auth, googleProvider)
}

export async function signInWithMicrosoft() {
  if (!auth) throw new Error("Firebase not configured")
  return signInWithPopup(auth, microsoftProvider)
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
