"use client"

import { useEffect } from "react"
import { applyUserPreferences, readUserPreferences } from "@/lib/user-preferences"

export default function UserPreferencesBoot() {
  useEffect(() => {
    applyUserPreferences(readUserPreferences())
  }, [])

  return null
}
