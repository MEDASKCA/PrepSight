"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthChange, type User } from "@/lib/auth"
import { hasProfile } from "@/lib/profile"
import AdminUnlocker from "./AdminUnlocker"

const PUBLIC_ROUTES    = ["/login"]
const ONBOARDING_ROUTE = "/onboarding"
const ADMIN_ROUTE      = "/admin"

const BRAND_LETTERS = "MEDASKCA".split("")

function isPrivateLanHost(host: string) {
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true
  const match172 = host.match(/^172\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/)
  if (!match172) return false
  const secondOctet = Number(match172[1])
  return secondOctet >= 16 && secondOctet <= 31
}

function isLocalPreviewHost() {
  if (typeof window === "undefined") return false
  const host = window.location.hostname
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || isPrivateLanHost(host)
}

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

  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    if (isLocalPreviewHost()) {
      setUser(null)
      return
    }
    return onAuthChange((u) => setUser(u))
  }, [])

  useEffect(() => {
    if (isLocalPreviewHost()) return
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

  if (isLocalPreviewHost()) {
    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <div className="min-w-0 flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
        <AdminUnlocker />
      </div>
    )
  }

  const isPublic = PUBLIC_ROUTES.includes(pathname)
  const isOnboarding = pathname === ONBOARDING_ROUTE
  const isAdmin = pathname.startsWith(ADMIN_ROUTE)
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
    <div className="min-h-screen bg-[#F4F7FA]">
      <div className="min-w-0 flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <AdminUnlocker />
    </div>
  )
}
