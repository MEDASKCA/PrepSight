"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { onAuthChange, type User } from "@/lib/auth"
import { hasProfile } from "@/lib/profile"
import Sidebar from "./Sidebar"
import MobileDrawer from "./MobileDrawer"
import AdminUnlocker from "./AdminUnlocker"
import FloatingChatButton from "./FloatingChatButton"

const PUBLIC_ROUTES    = ["/login"]
const ONBOARDING_ROUTE = "/onboarding"
const ADMIN_ROUTE      = "/admin"

const BRAND_LETTERS = "MEDASKCA".split("")

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-medaskca.png"
        alt="MEDASKCA"
        className="w-16 h-16 rounded-full mb-6"
        style={{ animation: "medaskca-pulse 2s ease-in-out infinite" }}
      />

      <div className="flex gap-1 mb-6">
        {BRAND_LETTERS.map((letter, i) => (
          <span
            key={i}
            className="text-2xl font-bold tracking-widest text-white"
            style={{ animation: `medaskca-pulse 2s ease-in-out ${i * 80}ms infinite` }}
          >
            {letter}
          </span>
        ))}
      </div>

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    return onAuthChange((u) => setUser(u))
  }, [])

  useEffect(() => {
    if (user === undefined) return

    const isPublic = PUBLIC_ROUTES.includes(pathname)
    const isOnboarding = pathname === ONBOARDING_ROUTE
    const isAdmin = pathname.startsWith(ADMIN_ROUTE)

    if (!user && !isPublic) { router.replace("/login"); return }
    if (user && isPublic) { router.replace("/"); return }
    if (user && hasProfile() && isOnboarding) { router.replace("/"); return }
    if (user && !hasProfile() && !isOnboarding && !isAdmin) { router.replace("/onboarding"); return }
  }, [user, pathname, router])

  if (user === undefined) {
    return <LoadingScreen message="Loading..." />
  }

  const isPublic = PUBLIC_ROUTES.includes(pathname)
  const isOnboarding = pathname === ONBOARDING_ROUTE
  const isAdmin = pathname.startsWith(ADMIN_ROUTE)
  const isTrueHomePage = pathname === "/" && searchParams.size === 0

  if (!user) {
    return isPublic
      ? <><AdminUnlocker />{children}</>
      : <LoadingScreen message="Loading..." />
  }

  if (isPublic) {
    return <LoadingScreen message="Loading..." />
  }

  if (!hasProfile()) {
    return isOnboarding
      ? <><AdminUnlocker />{children}</>
      : isAdmin
        ? <><AdminUnlocker />{children}</>
        : <LoadingScreen message="Loading..." />
  }

  if (isOnboarding) {
    return <LoadingScreen message="Loading..." />
  }

  if (isAdmin) {
    return <><AdminUnlocker />{children}</>
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FA]">
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0">
        <Sidebar />
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <Suspense>
          <MobileDrawer />
        </Suspense>
        <main className="flex-1">{children}</main>
        {!isTrueHomePage && <FloatingChatButton />}
      </div>
      <AdminUnlocker />
    </div>
  )
}
