"use client"

import { useEffect } from "react"

export default function PWARegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const isLocalHost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"

    if (isLocalHost) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister()
        })
      }).catch(() => {
        // Ignore cleanup failures on local development.
      })
      return
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration failures in development fallback scenarios.
    })
  }, [])

  return null
}
