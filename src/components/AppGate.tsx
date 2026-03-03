"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthChange, type User } from "@/lib/auth"
import { hasProfile, resolveProfile } from "@/lib/profile"
import Sidebar from "./Sidebar"
import MobileDrawer from "./MobileDrawer"
import SplashScreen from "./SplashScreen"

const PUBLIC_ROUTES = ["/login"]
const ONBOARDING_ROUTE = "/onboarding"

function Spinner({ message = "Loading PrepSight…" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="w-8 h-8 border-2 border-[#D5DCE3] border-t-[#4DA3FF] rounded-full animate-spin" />
        <p className="text-sm text-[#94a3b8]">{message}</p>
      </div>
    </div>
  )
}

export default function AppGate({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()

  const [user,            setUser]            = useState<User | null | undefined>(undefined)
  const [profileChecking, setProfileChecking] = useState(false)
  const [showSplash,      setShowSplash]      = useState(false)

  // Splash: only on first session visit
  useEffect(() => {
    if (!sessionStorage.getItem("splash_shown")) setShowSplash(true)
  }, [])

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

  // ── All router.replace() calls live here — never during render ──────────────
  useEffect(() => {
    if (user === undefined) return   // still resolving auth
    if (profileChecking)   return   // still resolving profile

    const isPublic     = PUBLIC_ROUTES.includes(pathname)
    const isOnboarding = pathname === ONBOARDING_ROUTE

    if (!user && !isPublic) {
      router.replace("/login")
      return
    }
    if (user && isPublic) {
      router.replace("/")
      return
    }
    if (user && !hasProfile() && !isOnboarding) {
      router.replace("/onboarding")
      return
    }
  }, [user, profileChecking, pathname, router])

  // ── Splash overlay (rendered over everything) ───────────────────────────────
  const splash = showSplash
    ? <SplashScreen onComplete={() => setShowSplash(false)} />
    : null

  // ── Auth resolving ──────────────────────────────────────────────────────────
  if (user === undefined) {
    return <>{splash}<Spinner /></>
  }

  // ── Profile resolving ───────────────────────────────────────────────────────
  if (profileChecking) {
    return <>{splash}<Spinner message="Setting up your profile…" /></>
  }

  const isPublic     = PUBLIC_ROUTES.includes(pathname)
  const isOnboarding = pathname === ONBOARDING_ROUTE

  // ── Not signed in: show login page; spinner on protected routes (redirect pending)
  if (!user) {
    return isPublic ? <>{splash}{children}</> : <>{splash}<Spinner /></>
  }

  // ── Signed in on public route: spinner while redirect fires ─────────────────
  if (isPublic) {
    return <>{splash}<Spinner /></>
  }

  // ── No profile: show onboarding page; spinner elsewhere (redirect pending) ──
  if (!hasProfile()) {
    return isOnboarding ? <>{splash}{children}</> : <>{splash}<Spinner /></>
  }

  // ── Onboarding with a profile: spinner while redirect fires to / ────────────
  if (isOnboarding) {
    return <>{splash}<Spinner /></>
  }

  // ── Fully authenticated with profile ────────────────────────────────────────
  return (
    <>
      {splash}
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
    </>
  )
}
