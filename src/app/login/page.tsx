"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithGoogle, signInWithMicrosoft } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<"google" | "microsoft" | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogle() {
    setError(null)
    setLoading("google")
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign-in failed"
      if (!msg.includes("popup-closed")) setError(msg)
    } finally {
      setLoading(null)
    }
  }

  async function handleMicrosoft() {
    setError(null)
    setLoading("microsoft")
    try {
      await signInWithMicrosoft()
      router.push("/")
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign-in failed"
      if (!msg.includes("popup-closed")) setError(msg)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="PrepSight"
            className="w-full mx-auto mb-3"
          />
          <p className="text-sm text-[#64748b]">Every procedure. Every setting. Every team.</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#D5DCE3] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#3F4752] mb-1">Sign in</h2>
          <p className="text-sm text-[#64748b] mb-6">
            Use your work or personal account to continue.
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D5DCE3] rounded-xl text-sm font-semibold text-[#3F4752] hover:bg-[#F4F7FA] transition-colors disabled:opacity-50 mb-3"
          >
            {loading === "google" ? (
              <span className="w-5 h-5 border-2 border-[#D5DCE3] border-t-[#4DA3FF] rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {/* Microsoft */}
          <button
            onClick={handleMicrosoft}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#D5DCE3] rounded-xl text-sm font-semibold text-[#3F4752] hover:bg-[#F4F7FA] transition-colors disabled:opacity-50"
          >
            {loading === "microsoft" ? (
              <span className="w-5 h-5 border-2 border-[#D5DCE3] border-t-[#4DA3FF] rounded-full animate-spin" />
            ) : (
              <MicrosoftIcon />
            )}
            Continue with Microsoft
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-[#94a3b8] text-center leading-relaxed">
          PrepSight holds no patient data.
          Sign-in is used only to save your preferences and role.
          <br />
          Your organisation&apos;s IT policy applies to personal device use.
        </p>
        <p className="mt-3 text-xs text-[#b0bcc8] text-center">
          PrepSight is a product of MEDASKCA&#8482;
        </p>

      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <rect width="8.5" height="8.5" fill="#F25022"/>
      <rect x="9.5" width="8.5" height="8.5" fill="#7FBA00"/>
      <rect y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
    </svg>
  )
}
