"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthChange, type User } from "@/lib/auth"
import { hasProfile, resolveProfile } from "@/lib/profile"
import Sidebar from "./Sidebar"
import MobileDrawer from "./MobileDrawer"

const PUBLIC_ROUTES  = ["/login"]
const ONBOARDING_ROUTE = "/onboarding"

const BRAND_LETTERS = "MEDASKCA".split("")

// ── Loading screen ─────────────────────────────────────────────────────────
function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* MEDASKCA logo mark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-medaskca.png"
        alt="MEDASKCA"
        className="w-16 h-16 rounded-full mb-6"
        style={{ animation: "medaskca-pulse 2s ease-in-out infinite" }}
      />

      {/* MEDASKCA animated wordmark */}
      <div className="flex gap-1 mb-6">
        {BRAND_LETTERS.map((letter, i) => (
          <span
            key={i}
            className="text-2xl font-bold tracking-widest text-white"
            style={{
              animation: `medaskca-pulse 2s ease-in-out ${i * 80}ms infinite`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>

      {/* Dot loader */}
      <div className="flex gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#00B4D8]"
            style={{ animation: `dot-bounce 1.2s ease-in-out ${i * 200}ms infinite` }}
          />
        ))}
      </div>

      <p className="text-xs text-[#555] tracking-widest uppercase">{message}</p>
    </div>
  )
}

export default function AppGate({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()

  const [user,            setUser]            = useState<User | null | undefined>(undefined)
  const [profileChecking, setProfileChecking] = useState(false)

  // Auth listener
  useEffect(() => {
    return onAuthChange((u) => setUser(u))
  }, [])

  // When signed-in with no local profile, fall back to Firestore
  useEffect(() => {
    if (!user) return
    if (hasProfile()) return
    if (PUBLIC_ROUTES.includes(pathname) || pathname === ONBOARDING_ROUTE) return

    setProfileChecking(true)
    resolveProfile(user.uid).finally(() => setProfileChecking(false))
  }, [user, pathname])

  // ── All router.replace() calls live here — never during render ──────────
  useEffect(() => {
    if (user === undefined) return
    if (profileChecking)   return

    const isPublic     = PUBLIC_ROUTES.includes(pathname)
    const isOnboarding = pathname === ONBOARDING_ROUTE

    if (!user && !isPublic)                          { router.replace("/login");      return }
    if (user && isPublic)                            { router.replace("/");           return }
    if (user && !hasProfile() && !isOnboarding)      { router.replace("/onboarding"); return }
  }, [user, profileChecking, pathname, router])

  // ── Auth resolving ──────────────────────────────────────────────────────
  if (user === undefined) {
    return <LoadingScreen message="Loading…" />
  }

  // ── Profile resolving ───────────────────────────────────────────────────
  if (profileChecking) {
    return <LoadingScreen message="Setting up your profile…" />
  }

  const isPublic     = PUBLIC_ROUTES.includes(pathname)
  const isOnboarding = pathname === ONBOARDING_ROUTE

  if (!user) {
    return isPublic ? <>{children}</> : <LoadingScreen message="Loading…" />
  }

  if (isPublic) {
    return <LoadingScreen message="Loading…" />
  }

  if (!hasProfile()) {
    return isOnboarding ? <>{children}</> : <LoadingScreen message="Loading…" />
  }

  if (isOnboarding) {
    return <LoadingScreen message="Loading…" />
  }

  // ── Fully authenticated with profile ────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-[#F4F7FA]">
      <aside className="hidden lg:flex w-60 shrink-0 h-screen sticky top-0 overflow-hidden">
        <Sidebar />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <Suspense>
          <MobileDrawer />
        </Suspense>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
