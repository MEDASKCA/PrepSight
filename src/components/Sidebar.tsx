"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search, Package, X } from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { getProcedureById } from "@/lib/data"
import { surgeons as surgeonList, getSurgeonLibrary } from "@/lib/surgeons"
import { CLINICAL_SETTINGS } from "@/lib/settings"
import { ClinicalSetting, Procedure, USER_ROLE_LABEL } from "@/lib/types"
import { getProfile, getRelevantSettings } from "@/lib/profile"

type ViewMode = "setting" | "surgeon" | "supplier"

const SUPPLIER_PLACEHOLDERS = ["Stryker", "Zimmer Biomet", "Arthrex", "Olympus", "Smith+Nephew"]

const TAB_ACTIVE = "bg-[#4DA3FF] text-white"
const TAB_IDLE   = "text-[#64748b] hover:bg-[#F4F7FA]"

export default function Sidebar() {
  const pathname = usePathname()

  const [query, setQuery]                     = useState("")
  const [viewMode, setViewMode]               = useState<ViewMode>("setting")
  const [selectedSetting, setSelectedSetting] = useState<ClinicalSetting | null>(null)
  const [selectedSurgeon, setSelectedSurgeon] = useState<string | null>(null)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const profile    = useMemo(() => getProfile(), [])

  // ── Data ──────────────────────────────────────────────────────────────────────
  const tree = useMemo(() => {
    const map = new Map<ClinicalSetting, Map<string, typeof procedures>>()
    for (const setting of CLINICAL_SETTINGS) map.set(setting, new Map())
    for (const p of procedures) {
      const specMap = map.get(p.setting)
      if (!specMap) continue
      const list = specMap.get(p.specialty) ?? []
      list.push(p)
      specMap.set(p.specialty, list)
    }
    for (const [key, val] of map.entries()) {
      if (val.size === 0) map.delete(key)
    }
    return map
  }, [])

  const filteredTree = useMemo(() => {
    if (!query.trim()) return tree
    const q = query.toLowerCase()
    const result = new Map<ClinicalSetting, Map<string, typeof procedures>>()
    for (const [setting, specMap] of tree.entries()) {
      const settingMatch = setting.toLowerCase().includes(q)
      const filteredSpecs = new Map<string, typeof procedures>()
      for (const [spec, procs] of specMap.entries()) {
        const specMatch = spec.toLowerCase().includes(q)
        const filteredProcs = procs.filter(
          (p) => settingMatch || specMatch || p.name.toLowerCase().includes(q)
        )
        if (filteredProcs.length > 0) filteredSpecs.set(spec, filteredProcs)
      }
      if (filteredSpecs.size > 0) result.set(setting, filteredSpecs)
    }
    return result
  }, [tree, query])

  const surgeonTree = useMemo(() => {
    const map = new Map<string, Procedure[]>()
    for (const surgeon of surgeonList) {
      const library = getSurgeonLibrary(surgeon.id)
      const procs = library
        .map((sp) => getProcedureById(sp.procedureId))
        .filter((p): p is Procedure => p !== undefined)
      if (procs.length > 0) map.set(surgeon.name, procs)
    }
    return map
  }, [])

  const filteredSurgeonTree = useMemo(() => {
    if (!query.trim()) return surgeonTree
    const q = query.toLowerCase()
    const result = new Map<string, Procedure[]>()
    for (const [surgeon, procs] of surgeonTree.entries()) {
      const surgeonMatch = surgeon.toLowerCase().includes(q)
      const filteredProcs = procs.filter(
        (p) => surgeonMatch || p.name.toLowerCase().includes(q)
      )
      if (filteredProcs.length > 0) result.set(surgeon, filteredProcs)
    }
    return result
  }, [surgeonTree, query])

  // ── Close flyout on outside click ─────────────────────────────────────────
  useEffect(() => {
    if (!selectedSetting && !selectedSurgeon) return
    function onMouseDown(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setSelectedSetting(null)
        setSelectedSurgeon(null)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [selectedSetting, selectedSurgeon])

  function closeFlyout() {
    setSelectedSetting(null)
    setSelectedSurgeon(null)
  }

  const flyoutSettingData = selectedSetting ? filteredTree.get(selectedSetting) : null
  const flyoutSurgeonData = selectedSurgeon ? filteredSurgeonTree.get(selectedSurgeon) : null
  const isFlyoutOpen      = selectedSetting !== null || selectedSurgeon !== null

  return (
    <div ref={sidebarRef} className="flex h-full">

      {/* ── Primary column ──────────────────────────────────────────────────── */}
      <div className="w-60 shrink-0 flex flex-col h-full border-r border-[#D5DCE3] bg-white">

        {/* Logo + profile */}
        <div className="px-4 py-4 border-b border-[#D5DCE3] shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/ps-mark.png" alt="PrepSight" width={48} height={28} className="w-auto h-7" />
            <span className="text-base font-bold text-[#00B4D8] tracking-tight">PrepSight</span>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#4DA3FF] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{profile.role[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#3F4752] truncate">{USER_ROLE_LABEL[profile.role] ?? profile.role}</p>
                {profile.departments[0] && (
                  <p className="text-xs text-[#94a3b8] truncate">{profile.departments[0]}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="px-3 py-3 border-b border-[#D5DCE3] shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-[#D5DCE3] rounded-lg bg-[#F4F7FA] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex px-3 py-2 gap-1 border-b border-[#D5DCE3] shrink-0">
          <button
            onClick={() => { setViewMode("setting"); closeFlyout() }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "setting" ? TAB_ACTIVE : TAB_IDLE}`}
          >
            Setting
          </button>
          <button
            onClick={() => { setViewMode("surgeon"); closeFlyout() }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "surgeon" ? TAB_ACTIVE : TAB_IDLE}`}
          >
            Surgeon
          </button>
          <button
            onClick={() => { setViewMode("supplier"); closeFlyout() }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "supplier" ? TAB_ACTIVE : TAB_IDLE}`}
          >
            Supplier
          </button>
        </div>

        {/* Primary list */}
        <div className="flex-1 overflow-y-auto py-2">

          {/* Settings */}
          {viewMode === "setting" && (
            <div className="px-2 space-y-0.5">
              {Array.from(filteredTree.entries()).map(([setting, specMap]) => {
                const isSelected = selectedSetting === setting
                return (
                  <button
                    key={setting}
                    onClick={() => {
                      setSelectedSetting(isSelected ? null : setting)
                      setSelectedSurgeon(null)
                    }}
                    className={`w-full flex items-center gap-2 h-10 px-2.5 rounded-lg text-left transition-all ${
                      isSelected ? "bg-[#4DA3FF] text-white" : "hover:bg-[#F4F7FA] text-[#3F4752]"
                    }`}
                  >
                    <span className="flex-1 text-sm font-semibold truncate">{setting}</span>
                    <span className={`text-xs tabular-nums shrink-0 ${isSelected ? "text-white/50" : "text-[#94a3b8]"}`}>
                      {specMap.size}
                    </span>
                    <ChevronRight size={13} className={`shrink-0 ${isSelected ? "text-white/60" : "text-[#94a3b8]"}`} />
                  </button>
                )
              })}
              {filteredTree.size === 0 && (
                <p className="px-2 py-4 text-sm text-[#94a3b8]">No results.</p>
              )}
            </div>
          )}

          {/* Surgeons */}
          {viewMode === "surgeon" && (
            <div className="px-2 space-y-0.5">
              {Array.from(filteredSurgeonTree.entries()).map(([surgeon, procs]) => {
                const isSelected = selectedSurgeon === surgeon
                return (
                  <button
                    key={surgeon}
                    onClick={() => {
                      setSelectedSurgeon(isSelected ? null : surgeon)
                      setSelectedSetting(null)
                    }}
                    className={`w-full flex items-center gap-2 h-10 px-2.5 rounded-lg text-left transition-all ${
                      isSelected ? "bg-[#4DA3FF] text-white" : "hover:bg-[#F4F7FA] text-[#3F4752]"
                    }`}
                  >
                    <span className="flex-1 text-sm font-semibold truncate">{surgeon}</span>
                    <span className={`text-xs tabular-nums shrink-0 ${isSelected ? "text-white/50" : "text-[#94a3b8]"}`}>
                      {procs.length}
                    </span>
                    <ChevronRight size={13} className={`shrink-0 ${isSelected ? "text-white/60" : "text-[#94a3b8]"}`} />
                  </button>
                )
              })}
              {filteredSurgeonTree.size === 0 && (
                <p className="px-2 py-4 text-sm text-[#94a3b8]">Surgeons will appear here once added to procedure cards.</p>
              )}
            </div>
          )}

          {/* Supplier placeholder */}
          {viewMode === "supplier" && (
            <div className="px-2 py-1 space-y-0.5">
              {SUPPLIER_PLACEHOLDERS.map((name) => (
                <div key={name} className="flex items-center gap-2 h-10 px-2.5 opacity-40 cursor-default">
                  <Package size={14} className="text-[#94a3b8] shrink-0" />
                  <span className="flex-1 text-sm text-[#3F4752]">{name}</span>
                  <span className="text-xs bg-[#F4F7FA] text-[#94a3b8] px-1.5 py-0.5 rounded">Soon</span>
                </div>
              ))}
              <p className="px-2 pt-3 text-xs text-[#94a3b8] text-center">Supplier catalogues coming soon</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-[#D5DCE3] shrink-0">
          <p className="text-xs text-[#94a3b8]">PrepSight · v0.4</p>
        </div>
      </div>

      {/* ── Flyout panel ────────────────────────────────────────────────────── */}
      {isFlyoutOpen && (
        <div className="w-56 shrink-0 flex flex-col h-full border-r border-[#D5DCE3] bg-white">
          <div className="px-4 py-3.5 border-b border-[#D5DCE3] flex items-center gap-2 shrink-0">
            <p className="flex-1 text-sm font-bold text-[#3F4752] truncate">
              {selectedSetting ?? selectedSurgeon}
            </p>
            <button
              onClick={closeFlyout}
              className="shrink-0 p-0.5 rounded text-[#94a3b8] hover:text-[#3F4752] hover:bg-[#F4F7FA] transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-1">
            {flyoutSettingData && Array.from(flyoutSettingData.entries()).map(([spec, procs]) => (
              <Link
                key={spec}
                href={`/?setting=${encodeURIComponent(selectedSetting!)}&specialty=${encodeURIComponent(spec)}`}
                onClick={closeFlyout}
                className="flex items-center justify-between px-4 h-10 text-sm text-[#475569] hover:bg-[#F4F7FA] hover:text-[#2F8EF7] transition-colors"
              >
                <span>{spec}</span>
                <span className="text-xs text-[#94a3b8] tabular-nums">{procs.length}</span>
              </Link>
            ))}
            {selectedSetting && !flyoutSettingData && (
              <p className="px-4 py-4 text-sm text-[#94a3b8]">No specialties match.</p>
            )}
            {flyoutSurgeonData && flyoutSurgeonData.map((p) => {
              const isActive = pathname === `/procedures/${p.id}`
              return (
                <Link
                  key={p.id}
                  href={`/procedures/${p.id}`}
                  onClick={closeFlyout}
                  className={`flex items-center px-4 h-10 text-sm transition-colors ${
                    isActive
                      ? "text-[#2F8EF7] font-semibold bg-[#EFF8FF]"
                      : "text-[#475569] hover:bg-[#F4F7FA] hover:text-[#2F8EF7]"
                  }`}
                >
                  {p.name}
                </Link>
              )
            })}
            {selectedSurgeon && !flyoutSurgeonData && (
              <p className="px-4 py-4 text-sm text-[#94a3b8]">No procedures match.</p>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
