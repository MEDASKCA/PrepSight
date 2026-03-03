import type { Metadata, Viewport } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import AppGate from "@/components/AppGate"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PrepSight",
  description: "Universal clinical procedure reference platform",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.className}>
      <body>
        <AppGate>{children}</AppGate>
      </body>
    </html>
  )
}
