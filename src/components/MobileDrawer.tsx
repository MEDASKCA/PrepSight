"use client"

import { useState, Suspense } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { Kalam } from "next/font/google"
import SidebarNavTree from "./SidebarNavTree"
import ProfileButton from "./ProfileButton"

const kalam = Kalam({ subsets: ["latin"], weight: "700" })

export default function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar — always visible on mobile */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#D5DCE3] sticky top-0 z-40">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F4F7FA] transition-colors"
        >
          <Menu size={22} className="text-[#3F4752]" />
        </button>

        <Link href="/" className="flex flex-col items-center leading-none">
          <span className={`${kalam.className} text-base text-[#9CA3AF]`}>P.S.</span>
          <span className="text-sm font-bold text-[#00B4D8] tracking-tight">PrepSight</span>
        </Link>

        <ProfileButton />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed left-0 top-0 h-full w-[300px] bg-white shadow-xl z-50 flex flex-col lg:hidden transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-[300px]"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#D5DCE3]">
          <div className="flex flex-col items-start leading-none">
            <span className={`${kalam.className} text-xl text-[#9CA3AF]`}>P.S.</span>
            <span className="text-lg font-bold text-[#00B4D8] tracking-tight">PrepSight</span>
            <p className="text-xs text-[#94a3b8] mt-0.5">Clinical Procedure Reference</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F4F7FA] transition-colors"
          >
            <X size={18} className="text-[#64748b]" />
          </button>
        </div>

        {/* Nav tree */}
        <div className="flex-1 min-h-0">
          <Suspense fallback={<div className="p-3 text-sm text-[#94a3b8]">Loading...</div>}>
            <SidebarNavTree onNavigate={() => setOpen(false)} />
          </Suspense>
        </div>

        <div className="px-4 py-3 border-t border-[#D5DCE3]">
          <p className="text-xs text-[#94a3b8]">PrepSight · v0.3</p>
        </div>
      </div>
    </>
  )
}
