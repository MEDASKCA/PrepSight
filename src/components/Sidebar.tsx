import Link from "next/link"
import { Suspense } from "react"
import SidebarNavTree from "./SidebarNavTree"

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full border-r border-[#D5DCE3] bg-white">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#D5DCE3]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#003366]">PrepSight</span>
        </Link>
        <p className="text-xs text-[#94a3b8] mt-0.5">Clinical Procedure Reference</p>
      </div>

      {/* Nav tree — flex-1 so it fills the sidebar */}
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="p-3 text-sm text-[#94a3b8]">Loading...</div>}>
          <SidebarNavTree />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#D5DCE3]">
        <p className="text-xs text-[#94a3b8]">PrepSight · v0.2</p>
      </div>
    </div>
  )
}
