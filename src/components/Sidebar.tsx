"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Search, Package, X } from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { getProcedureById } from "@/lib/data"
import { surgeons as surgeonList, getSurgeonLibrary } from "@/lib/surgeons"
import { CLINICAL_SETTINGS, SETTING_SPECIALTIES } from "@/lib/settings"
import { ClinicalSetting, Procedure, USER_ROLE_LABEL } from "@/lib/types"
import { getProfile } from "@/lib/profile"
import { canonicalSpecialtyName } from "@/lib/specialty-normalization"

type ViewMode = "setting" | "surgeon" | "supplier"

const SUPPLIER_PLACEHOLDERS = ["Stryker", "Zimmer Biomet", "Arthrex", "Olympus", "Smith+Nephew"]

const TAB_ACTIVE = "bg-[#4DA3FF] text-white shadow-sm"
const TAB_IDLE = "text-slate-600 hover:bg-slate-100"

export default function Sidebar() {
  const pathname = usePathname()

  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("setting")
  const [selectedSetting, setSelectedSetting] = useState<ClinicalSetting | null>(null)
  const [selectedSurgeon, setSelectedSurgeon] = useState<string | null>(null)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const profile = useMemo(() => getProfile(), [])

  const tree = useMemo(() => {
    const map = new Map<ClinicalSetting, Map<string, typeof procedures>>()
    for (const setting of CLINICAL_SETTINGS) {
      const specMap = new Map<string, typeof procedures>()
      for (const specialty of SETTING_SPECIALTIES[setting] ?? []) {
        specMap.set(specialty, [])
      }
      map.set(setting, specMap)
    }
    for (const p of procedures) {
      const specMap = map.get(p.setting)
      if (!specMap) continue
      const specialty = canonicalSpecialtyName(p.setting, p.specialty)
      const list = specMap.get(specialty) ?? []
      list.push(p)
      specMap.set(specialty, list)
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
        if (filteredProcs.length > 0 || settingMatch || specMatch) {
          filteredSpecs.set(spec, filteredProcs)
        }
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
  const isFlyoutOpen = selectedSetting !== null || selectedSurgeon !== null

  return (
    <div ref={sidebarRef} className="flex h-full">
      <div className="w-72 shrink-0 flex flex-col h-full border-r border-slate-200 bg-white">
        <div data-dev-trigger className="px-4 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Image src="/ps-mark.png" alt="PrepSight" width={48} height={28} className="w-auto h-7" />
            <span className="text-base font-bold text-cyan-500 tracking-tight">PrepSight</span>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{profile.role[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{USER_ROLE_LABEL[profile.role] ?? profile.role}</p>
                {profile.departments[0] && (
                  <p className="text-xs text-slate-400 truncate">{profile.departments[0]}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-3 pt-3 shrink-0">
          <Link
            href="/procedures/new"
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-sky-300 text-sky-600 text-xs font-semibold hover:bg-sky-50 transition-colors"
          >
            <span className="text-base leading-none">+</span> New procedure card
          </Link>
        </div>

        <div className="px-3 py-3 border-b border-slate-200 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex px-3 py-2 gap-1 border-b border-slate-200 shrink-0">
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

        <div className="flex-1 overflow-y-auto py-2">
          {viewMode === "setting" && (
            <div className="px-2 space-y-1">
              {Array.from(filteredTree.entries()).map(([setting, specMap]) => {
                const isSelected = selectedSetting === setting
                return (
                  <button
                    key={setting}
                    onClick={() => {
                      setSelectedSetting(isSelected ? null : setting)
                      setSelectedSurgeon(null)
                    }}
                    className={`w-full flex items-start gap-3 min-h-11 py-2.5 px-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-slate-100 text-slate-900 border-slate-200 shadow-sm"
                        : "bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <span className="flex-1 min-w-0 whitespace-normal break-words text-sm font-semibold leading-snug">{setting}</span>
                    <span className={`text-[11px] tabular-nums shrink-0 pt-0.5 ${isSelected ? "text-slate-500" : "text-slate-400"}`}>
                      {specMap.size} {specMap.size === 1 ? "specialty" : "specialties"}
                    </span>
                    <ChevronRight size={13} className={`shrink-0 mt-0.5 ${isSelected ? "text-slate-500" : "text-slate-400"}`} />
                  </button>
                )
              })}
              {filteredTree.size === 0 && (
                <p className="px-2 py-4 text-sm text-slate-400">No results.</p>
              )}
            </div>
          )}

          {viewMode === "surgeon" && (
            <div className="px-2 space-y-1">
              {Array.from(filteredSurgeonTree.entries()).map(([surgeon, procs]) => {
                const isSelected = selectedSurgeon === surgeon
                return (
                  <button
                    key={surgeon}
                    onClick={() => {
                      setSelectedSurgeon(isSelected ? null : surgeon)
                      setSelectedSetting(null)
                    }}
                    className={`w-full flex items-center gap-2 min-h-11 px-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-slate-100 text-slate-900 border-slate-200 shadow-sm"
                        : "bg-white text-slate-700 border-transparent hover:bg-slate-50 hover:border-slate-200"
                    }`}
                  >
                    <span className="flex-1 text-sm font-semibold truncate">{surgeon}</span>
                    <ChevronRight size={13} className={`${isSelected ? "text-slate-500" : "text-slate-400"}`} />
                    <span className={`text-[11px] tabular-nums text-right min-w-[6.5rem] shrink-0 ${isSelected ? "text-slate-500" : "text-slate-400"}`}>
                      {procs.length} {procs.length === 1 ? "procedure" : "procedures"}
                    </span>
                  </button>
                )
              })}
              {filteredSurgeonTree.size === 0 && (
                <p className="px-2 py-4 text-sm text-slate-400">Surgeons will appear here once added to procedure cards.</p>
              )}
            </div>
          )}

          {viewMode === "supplier" && (
            <div className="px-2 py-1 space-y-1">
              {SUPPLIER_PLACEHOLDERS.map((name) => (
                <div key={name} className="flex items-center gap-2 h-10 px-2.5 opacity-50 cursor-default rounded-lg">
                  <Package size={14} className="text-slate-400 shrink-0" />
                  <span className="flex-1 text-sm text-slate-700">{name}</span>
                  <span className="text-xs bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">Soon</span>
                </div>
              ))}
              <p className="px-2 pt-3 text-xs text-slate-400 text-center">Supplier catalogues coming soon</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-slate-200 shrink-0">
          <p className="text-xs text-slate-400">PrepSight · v0.4</p>
        </div>
      </div>

      {isFlyoutOpen && (
        <div className="w-80 shrink-0 flex flex-col h-full border-r border-slate-200 bg-white">
          <div className="px-4 py-3.5 border-b border-[#4DA3FF] flex items-center gap-2 shrink-0 bg-[#4DA3FF]">
            <p className="flex-1 text-sm font-bold text-white truncate">
              {selectedSetting ?? selectedSurgeon}
            </p>
            <button
              onClick={closeFlyout}
              className="shrink-0 p-1 rounded text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2">
            {flyoutSettingData && Array.from(flyoutSettingData.entries()).map(([spec, procs]) => (
              <Link
                key={spec}
                href={`/?setting=${encodeURIComponent(selectedSetting!)}&specialty=${encodeURIComponent(spec)}`}
                onClick={closeFlyout}
                className="flex items-start justify-between gap-3 px-3 py-2.5 min-h-11 text-sm text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition-colors"
              >
                <span className="flex-1 min-w-0 whitespace-normal break-words leading-snug">{spec}</span>
                <span className="text-[11px] text-slate-400 tabular-nums text-right min-w-[6rem] shrink-0 pt-0.5">
                  {procs.length} {procs.length === 1 ? "procedure" : "procedures"}
                </span>
              </Link>
            ))}
            {selectedSetting && !flyoutSettingData && (
              <p className="px-4 py-4 text-sm text-slate-400">No specialties match.</p>
            )}
            {flyoutSurgeonData && flyoutSurgeonData.map((p) => {
              const isActive = pathname === `/procedures/${p.id}`
              return (
                <Link
                  key={p.id}
                  href={`/procedures/${p.id}`}
                  onClick={closeFlyout}
                  className={`flex items-center px-4 min-h-11 text-sm rounded-xl transition-colors ${
                    isActive
                      ? "text-sky-700 font-semibold bg-sky-50 border border-sky-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-sky-700 border border-transparent"
                  }`}
                >
                  {p.name}
                </Link>
              )
            })}
            {selectedSurgeon && !flyoutSurgeonData && (
              <p className="px-4 py-4 text-sm text-slate-400">No procedures match.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}