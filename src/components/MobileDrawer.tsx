"use client"

import { useState, Suspense } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import SidebarNavTree from "./SidebarNavTree"
import ProfileButton from "./ProfileButton"

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
        <Link href="/"><img src="/logo.jpg" alt="PrepSight" className="h-8" /></Link>
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
        className={`fixed left-0 top-0 h-full w-[280px] bg-white shadow-xl z-50 flex flex-col lg:hidden transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-[280px]"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#D5DCE3]">
          <div>
            <img src="/logo.jpg" alt="PrepSight" className="w-24" />
            <p className="text-xs text-[#94a3b8]">Clinical Procedure Reference</p>
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
          <p className="text-xs text-[#94a3b8]">PrepSight · v0.2</p>
        </div>
      </div>
    </>
  )
}
