"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hasProfile } from "@/lib/profile"

export default function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!hasProfile()) {
      router.replace("/onboarding")
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) return null
  return <>{children}</>
}
