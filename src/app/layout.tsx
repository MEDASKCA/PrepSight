import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import Sidebar from "@/components/Sidebar"
import MobileDrawer from "@/components/MobileDrawer"

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PrepSight",
  description: "Universal clinical procedure reference platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.className}>
      <body className="flex min-h-screen bg-[#F4F7FA]">
        {/* Desktop sidebar — hidden below lg */}
        <aside className="hidden lg:flex w-60 shrink-0 h-screen sticky top-0 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <MobileDrawer />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
