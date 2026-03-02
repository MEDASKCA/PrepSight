"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthChange, type User } from "@/lib/auth"
import { hasProfile } from "@/lib/profile"
import Sidebar from "./Sidebar"
import MobileDrawer from "./MobileDrawer"

const PUBLIC_ROUTES = ["/login"]
const ONBOARDING_ROUTE = "/onboarding"

export default function AppGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  // undefined = still loading, null = not signed in, User = signed in
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsub = onAuthChange((u) => setUser(u))
    return unsub
  }, [])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-[#D5DCE3] border-t-[#4DA3FF] rounded-full animate-spin" />
          <p className="text-sm text-[#94a3b8]">Loading PrepSight…</p>
        </div>
      </div>
    )
  }

  // ── Public routes (login) — no auth required ─────────────────────────────
  if (PUBLIC_ROUTES.includes(pathname)) {
    // If already signed in, send them home
    if (user) {
      router.replace("/")
      return null
    }
    return <>{children}</>
  }

  // ── Not signed in — send to login ────────────────────────────────────────
  if (!user) {
    router.replace("/login")
    return null
  }

  // ── Signed in but no profile — send to onboarding ───────────────────────
  if (!hasProfile() && pathname !== ONBOARDING_ROUTE) {
    router.replace("/onboarding")
    return null
  }

  // ── Onboarding page — render without nav shell ───────────────────────────
  if (pathname === ONBOARDING_ROUTE) {
    return <>{children}</>
  }

  // ── Fully authenticated — render with nav shell ──────────────────────────
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
