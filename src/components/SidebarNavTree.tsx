"use client"

import { useState, useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ChevronDown, Search, User as UserIcon } from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { getProcedureById } from "@/lib/data"
import { surgeons as surgeonList, getSurgeonLibrary } from "@/lib/surgeons"
import { SETTING_COLOUR, CLINICAL_SETTINGS } from "@/lib/settings"
import { ClinicalSetting, Procedure } from "@/lib/types"
import { getProfile, getRelevantSettings } from "@/lib/profile"

interface Props {
  onNavigate?: () => void
}

type ViewMode = "setting" | "surgeon"

export default function SidebarNavTree({ onNavigate }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSetting   = searchParams.get("setting")
  const activeSpecialty = searchParams.get("specialty")

  const [query, setQuery]           = useState("")
  const [viewMode, setViewMode]     = useState<ViewMode>("setting")
  const [expandedSettings, setExpandedSettings]       = useState<Set<string>>(new Set())
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<string>>(new Set())
  const [expandedSurgeons, setExpandedSurgeons]       = useState<Set<string>>(new Set())

  // Read profile for soft filtering
  const profile = useMemo(() => getProfile(), [])
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

  // Split into relevant vs all for soft filtering
  const relevantEntries = Array.from(filteredTree.entries()).filter(([s]) =>
    relevantSettings.includes(s)
  )
  const otherEntries = Array.from(filteredTree.entries()).filter(([s]) =>
    !relevantSettings.includes(s)
  )
  const hasRelevant = relevantEntries.length > 0 && !query.trim()

  // Auto-expand when searching
  const effectiveExpandedSettings = query.trim()
    ? new Set(Array.from(filteredTree.keys()) as string[])
    : expandedSettings
  const effectiveExpandedSpecialties = query.trim()
    ? new Set(Array.from(filteredTree.values()).flatMap((m) => Array.from(m.keys())))
    : expandedSpecialties

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
  function toggleSpecialty(key: string) {
    setExpandedSpecialties((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
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

  // ── Render helpers ────────────────────────────────────────────────────────────
  function renderSettingGroup(entries: [ClinicalSetting, Map<string, typeof procedures>][]) {
    return entries.map(([setting, specMap]) => {
      const settingExpanded = effectiveExpandedSettings.has(setting)
      const isActiveSetting = activeSetting === setting

      return (
        <div key={setting}>
          <button
            onClick={() => toggleSetting(setting)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 h-10 text-left hover:bg-[#F4F7FA] transition-colors ${
              isActiveSetting && !activeSpecialty ? "bg-[#EFF8FF]" : ""
            }`}
          >
            <span className={`shrink-0 transition-transform duration-150 ${settingExpanded ? "rotate-90" : ""}`}>
              <ChevronRight size={14} className="text-[#94a3b8]" />
            </span>
            <span className="flex-1 text-sm font-bold text-[#3F4752] leading-snug">{setting}</span>
          </button>

          {settingExpanded && Array.from(specMap.entries()).map(([spec, procs]) => {
            const specKey = `${setting}::${spec}`
            const specExpanded = effectiveExpandedSpecialties.has(specKey)
            const isActiveSpec = isActiveSetting && activeSpecialty === spec

            return (
              <div key={spec}>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleSpecialty(specKey)}
                    className="shrink-0 pl-8 pr-1 py-2 h-10 hover:text-[#2F8EF7] transition-colors"
                    aria-label={`Expand ${spec}`}
                  >
                    {specExpanded
                      ? <ChevronDown size={12} className="text-[#94a3b8]" />
                      : <ChevronRight size={12} className="text-[#94a3b8]" />
                    }
                  </button>
                  <Link
                    href={`/?setting=${encodeURIComponent(setting)}&specialty=${encodeURIComponent(spec)}`}
                    onClick={onNavigate}
                    className={`flex-1 flex items-center justify-between py-2 pr-3 h-10 text-sm transition-colors ${
                      isActiveSpec
                        ? "text-[#2F8EF7] font-semibold"
                        : "text-[#475569] hover:text-[#2F8EF7]"
                    }`}
                  >
                    <span>{spec}</span>
                    <span className="text-xs text-[#94a3b8]">{procs.length}</span>
                  </Link>
                </div>

                {specExpanded && procs.map((p) => {
                  const isActive = pathname === `/procedures/${p.id}`
                  return (
                    <Link
                      key={p.id}
                      href={`/procedures/${p.id}`}
                      onClick={onNavigate}
                      className={`block pl-14 pr-3 py-2 h-10 text-sm transition-colors ${
                        isActive
                          ? "text-[#2F8EF7] font-semibold bg-[#EFF8FF]"
                          : "text-[#64748b] hover:text-[#2F8EF7] hover:bg-[#F4F7FA]"
                      }`}
                    >
                      {p.name}
                    </Link>
                  )
                })}
              </div>
            )
          })}
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

      {/* Browse mode toggle */}
      <div className="flex px-3 py-2 gap-1 border-b border-[#D5DCE3]">
        <button
          onClick={() => setViewMode("setting")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === "setting"
              ? "bg-[#4DA3FF] text-white"
              : "text-[#64748b] hover:bg-[#F4F7FA]"
          }`}
        >
          Setting
        </button>
        <button
          onClick={() => setViewMode("surgeon")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            viewMode === "surgeon"
              ? "bg-[#4DA3FF] text-white"
              : "text-[#64748b] hover:bg-[#F4F7FA]"
          }`}
        >
          <UserIcon size={11} /> Surgeon
        </button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* ── Setting view ─────────────────────────────────────────────────── */}
        {viewMode === "setting" && (
          <>
            {hasRelevant ? (
              <>
                {/* Your areas */}
                <p className="px-3 pt-1 pb-1 text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
                  Your areas
                </p>
                {renderSettingGroup(relevantEntries)}

                {/* All areas divider */}
                {otherEntries.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 mt-1">
                      <div className="flex-1 h-px bg-[#E2E8F0]" />
                      <span className="text-xs text-[#94a3b8] font-medium">All areas</span>
                      <div className="flex-1 h-px bg-[#E2E8F0]" />
                    </div>
                    {renderSettingGroup(otherEntries)}
                  </>
                )}
              </>
            ) : (
              renderSettingGroup(Array.from(filteredTree.entries()))
            )}
          </>
        )}

        {/* ── Surgeon view ─────────────────────────────────────────────────── */}
        {viewMode === "surgeon" && (
          <>
            {Array.from(filteredSurgeonTree.entries()).map(([surgeon, procs]) => {
              const expanded = expandedSurgeons.has(surgeon)
              return (
                <div key={surgeon}>
                  <button
                    onClick={() => toggleSurgeon(surgeon)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 h-10 text-left hover:bg-[#F4F7FA] transition-colors"
                  >
                    <span className={`shrink-0 transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}>
                      <ChevronRight size={14} className="text-[#94a3b8]" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-[#3F4752]">{surgeon}</span>
                    <span className="text-xs text-[#94a3b8]">{procs.length}</span>
                  </button>
                  {expanded && procs.map((p) => {
                    const isActive = pathname === `/procedures/${p.id}`
                    return (
                      <Link
                        key={p.id}
                        href={`/procedures/${p.id}`}
                        onClick={onNavigate}
                        className={`block pl-10 pr-3 py-2 h-10 text-sm transition-colors ${
                          isActive
                            ? "text-[#2F8EF7] font-semibold bg-[#EFF8FF]"
                            : "text-[#64748b] hover:text-[#2F8EF7] hover:bg-[#F4F7FA]"
                        }`}
                      >
                        {p.name}
                      </Link>
                    )
                  })}
                </div>
              )
            })}
            {filteredSurgeonTree.size === 0 && (
              <p className="px-3 py-4 text-sm text-[#94a3b8]">No surgeons found.</p>
            )}
          </>
        )}

      </div>
    </div>
  )
}
