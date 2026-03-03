"use client"

import { useState, useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Search, Package } from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { getProcedureById } from "@/lib/data"
import { surgeons as surgeonList, getSurgeonLibrary } from "@/lib/surgeons"
import { CLINICAL_SETTINGS } from "@/lib/settings"
import { ClinicalSetting, Procedure } from "@/lib/types"
import { getProfile, getRelevantSettings } from "@/lib/profile"

interface Props {
  onNavigate?: () => void
}

type ViewMode = "setting" | "surgeon" | "supplier"

const SUPPLIER_PLACEHOLDERS = ["Stryker", "Zimmer Biomet", "Arthrex", "Olympus", "Smith+Nephew"]

const TAB_ACTIVE = "bg-[#4DA3FF] text-white"
const TAB_IDLE   = "text-[#64748b] hover:bg-[#F4F7FA]"

export default function SidebarNavTree({ onNavigate }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSetting   = searchParams.get("setting")
  const activeSpecialty = searchParams.get("specialty")

  const [query, setQuery]                                 = useState("")
  const [viewMode, setViewMode]                           = useState<ViewMode>("setting")
  const [expandedSettings, setExpandedSettings]           = useState<Set<string>>(new Set())
  const [expandedSurgeons, setExpandedSurgeons]           = useState<Set<string>>(new Set())

  const profile          = useMemo(() => getProfile(), [])
  const relevantSettings = useMemo(() =>
    profile ? getRelevantSettings(profile) : [],
  [profile])

  // ── Setting tree ─────────────────────────────────────────────────────────────
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

  const relevantEntries = Array.from(filteredTree.entries()).filter(([s]) => relevantSettings.includes(s))
  const otherEntries    = Array.from(filteredTree.entries()).filter(([s]) => !relevantSettings.includes(s))
  const hasRelevant     = relevantEntries.length > 0 && !query.trim()

  // Auto-expand settings when searching
  const effectiveExpandedSettings = query.trim()
    ? new Set(Array.from(filteredTree.keys()) as string[])
    : expandedSettings

  // ── Surgeon tree ─────────────────────────────────────────────────────────────
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

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function toggleSetting(s: string) {
    setExpandedSettings((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }
  function toggleSurgeon(name: string) {
    setExpandedSurgeons((prev) => {
      const next = new Set(prev)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })
  }

  // ── Section card renderer ─────────────────────────────────────────────────────
  function renderSettingCards(entries: [ClinicalSetting, Map<string, typeof procedures>][]) {
    return entries.map(([setting, specMap]) => {
      const isExpanded = effectiveExpandedSettings.has(setting)
      return (
        <div key={setting} className="rounded-xl overflow-hidden border border-[#D5DCE3] shadow-sm">
          {/* Card header */}
          <button
            onClick={() => toggleSetting(setting)}
            className={`w-full flex items-center gap-2 px-4 h-12 text-left transition-colors ${
              isExpanded ? "bg-[#2F8EF7]" : "bg-[#4DA3FF] hover:bg-[#2F8EF7]"
            }`}
          >
            <span className="flex-1 text-sm font-bold text-white leading-snug">{setting}</span>
            <span className="text-xs text-white/60 tabular-nums shrink-0">{specMap.size}</span>
            <ChevronRight
              size={14}
              className={`shrink-0 text-white/60 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>

          {/* Specialties — navigate directly, no drill-down */}
          {isExpanded && (
            <div className="border-t border-[#F0F4F8]">
              {Array.from(specMap.entries()).map(([spec, procs]) => {
                const isActive = activeSetting === setting && activeSpecialty === spec
                return (
                  <Link
                    key={spec}
                    href={`/?setting=${encodeURIComponent(setting)}&specialty=${encodeURIComponent(spec)}`}
                    onClick={onNavigate}
                    className={`flex items-center justify-between px-4 h-10 text-sm border-b border-[#F0F4F8] last:border-b-0 transition-colors ${
                      isActive
                        ? "bg-[#EFF8FF] text-[#2F8EF7] font-semibold"
                        : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF8FF] hover:text-[#2F8EF7]"
                    }`}
                  >
                    <span>{spec}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs text-[#94a3b8]">{procs.length}</span>
                      <ChevronRight size={11} className="text-[#94a3b8]" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="flex flex-col h-full">

      {/* Search */}
      <div className="px-3 py-3 border-b border-[#D5DCE3]">
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
      <div className="flex px-3 py-2 gap-1 border-b border-[#D5DCE3]">
        <button
          onClick={() => setViewMode("setting")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "setting" ? TAB_ACTIVE : TAB_IDLE}`}
        >
          Setting
        </button>
        <button
          onClick={() => setViewMode("surgeon")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "surgeon" ? TAB_ACTIVE : TAB_IDLE}`}
        >
          Surgeon
        </button>
        <button
          onClick={() => setViewMode("supplier")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === "supplier" ? TAB_ACTIVE : TAB_IDLE}`}
        >
          Supplier
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Setting view ──────────────────────────────────────────────────── */}
        {viewMode === "setting" && (
          <>
            {hasRelevant ? (
              <>
                <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Your areas
                </p>
                <div className="px-3 space-y-2 pb-2">
                  {renderSettingCards(relevantEntries)}
                </div>
                {otherEntries.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2">
                      <div className="flex-1 h-px bg-[#E2E8F0]" />
                      <span className="text-xs text-[#94a3b8] font-medium">All areas</span>
                      <div className="flex-1 h-px bg-[#E2E8F0]" />
                    </div>
                    <div className="px-3 space-y-2 pb-3">
                      {renderSettingCards(otherEntries)}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="px-3 py-3 space-y-2">
                {renderSettingCards(Array.from(filteredTree.entries()))}
              </div>
            )}
          </>
        )}

        {/* ── Surgeon view ──────────────────────────────────────────────────── */}
        {viewMode === "surgeon" && (
          <div className="px-3 py-3 space-y-2">
            {Array.from(filteredSurgeonTree.entries()).map(([surgeon, procs]) => {
              const expanded = expandedSurgeons.has(surgeon)
              return (
                <div key={surgeon} className="rounded-xl overflow-hidden border border-[#D5DCE3] shadow-sm">
                  <button
                    onClick={() => toggleSurgeon(surgeon)}
                    className={`w-full flex items-center gap-2 px-4 h-12 text-left transition-colors ${
                      expanded ? "bg-[#2F8EF7]" : "bg-[#4DA3FF] hover:bg-[#2F8EF7]"
                    }`}
                  >
                    <span className="flex-1 text-sm font-semibold text-white">{surgeon}</span>
                    <span className="text-xs text-white/60 tabular-nums shrink-0">{procs.length}</span>
                    <ChevronRight
                      size={14}
                      className={`shrink-0 text-white/60 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="border-t border-[#F0F4F8]">
                      {procs.map((p) => {
                        const isActive = pathname === `/procedures/${p.id}`
                        return (
                          <Link
                            key={p.id}
                            href={`/procedures/${p.id}`}
                            onClick={onNavigate}
                            className={`flex items-center px-4 h-10 text-sm border-b border-[#F0F4F8] last:border-b-0 transition-colors ${
                              isActive
                                ? "bg-[#EFF8FF] text-[#2F8EF7] font-semibold"
                                : "bg-[#F8FAFC] text-[#475569] hover:bg-[#EFF8FF] hover:text-[#2F8EF7]"
                            }`}
                          >
                            {p.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            {filteredSurgeonTree.size === 0 && (
              <p className="px-2 py-4 text-sm text-[#94a3b8]">Surgeons will appear here once added to procedure cards.</p>
            )}
          </div>
        )}

        {/* ── Supplier view ─────────────────────────────────────────────────── */}
        {viewMode === "supplier" && (
          <div className="px-3 py-3 space-y-1">
            {SUPPLIER_PLACEHOLDERS.map((name) => (
              <div
                key={name}
                className="flex items-center gap-2 h-10 px-2.5 opacity-40 cursor-default"
              >
                <Package size={14} className="text-[#94a3b8] shrink-0" />
                <span className="flex-1 text-sm text-[#3F4752]">{name}</span>
                <span className="text-xs bg-[#F4F7FA] text-[#94a3b8] px-1.5 py-0.5 rounded">Soon</span>
              </div>
            ))}
            <p className="px-2 pt-3 text-xs text-[#94a3b8] text-center">Supplier catalogues coming soon</p>
          </div>
        )}

      </div>
    </div>
  )
}
