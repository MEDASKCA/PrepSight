"use client"

import { useState, useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight, ChevronDown, Search } from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { SETTING_COLOUR, CLINICAL_SETTINGS } from "@/lib/settings"
import { ClinicalSetting } from "@/lib/types"

interface Props {
  onNavigate?: () => void
}

export default function SidebarNavTree({ onNavigate }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSetting   = searchParams.get("setting")
  const activeSpecialty = searchParams.get("specialty")

  const [query, setQuery] = useState("")
  const [expandedSettings, setExpandedSettings]     = useState<Set<string>>(new Set())
  const [expandedSpecialties, setExpandedSpecialties] = useState<Set<string>>(new Set())

  // Build tree from procedures
  const tree = useMemo(() => {
    const map = new Map<ClinicalSetting, Map<string, typeof procedures>>()
    for (const setting of CLINICAL_SETTINGS) {
      map.set(setting, new Map())
    }
    for (const p of procedures) {
      const specMap = map.get(p.setting)
      if (!specMap) continue
      const list = specMap.get(p.specialty) ?? []
      list.push(p)
      specMap.set(p.specialty, list)
    }
    // Remove empty settings
    for (const [key, val] of map.entries()) {
      if (val.size === 0) map.delete(key)
    }
    return map
  }, [])

  // Filter tree by search query
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
          (p) =>
            settingMatch ||
            specMatch ||
            p.name.toLowerCase().includes(q)
        )
        if (filteredProcs.length > 0) filteredSpecs.set(spec, filteredProcs)
      }
      if (filteredSpecs.size > 0) result.set(setting, filteredSpecs)
    }
    return result
  }, [tree, query])

  // Auto-expand when filtering
  const effectiveExpandedSettings = query.trim()
    ? new Set(Array.from(filteredTree.keys()) as string[])
    : expandedSettings

  const effectiveExpandedSpecialties = query.trim()
    ? new Set(
        Array.from(filteredTree.values()).flatMap((m) => Array.from(m.keys()))
      )
    : expandedSpecialties

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

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {Array.from(filteredTree.entries()).map(([setting, specMap]) => {
          const settingExpanded = effectiveExpandedSettings.has(setting)
          const badgeClass = SETTING_COLOUR[setting] ?? "bg-gray-100 text-gray-700"
          const isActiveSetting = activeSetting === setting

          return (
            <div key={setting}>
              {/* Setting row */}
              <button
                onClick={() => toggleSetting(setting)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#F4F7FA] transition-colors ${
                  isActiveSetting && !activeSpecialty ? "bg-[#EFF8FF]" : ""
                }`}
              >
                <span className={`shrink-0 transition-transform duration-150 ${settingExpanded ? "rotate-90" : ""}`}>
                  <ChevronRight size={14} className="text-[#94a3b8]" />
                </span>
                <span className="flex-1 text-xs font-bold text-[#3F4752] leading-snug">{setting}</span>
              </button>

              {/* Specialty rows */}
              {settingExpanded && Array.from(specMap.entries()).map(([spec, procs]) => {
                const specKey = `${setting}::${spec}`
                const specExpanded = effectiveExpandedSpecialties.has(specKey)
                const isActiveSpec = isActiveSetting && activeSpecialty === spec

                return (
                  <div key={spec}>
                    {/* Specialty row */}
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSpecialty(specKey)}
                        className="shrink-0 pl-7 pr-1 py-1.5 hover:text-[#2F8EF7] transition-colors"
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
                        className={`flex-1 flex items-center justify-between py-1.5 pr-3 text-sm transition-colors ${
                          isActiveSpec
                            ? "text-[#2F8EF7] font-semibold"
                            : "text-[#475569] hover:text-[#2F8EF7]"
                        }`}
                      >
                        <span>{spec}</span>
                        <span className="text-xs text-[#94a3b8]">{procs.length}</span>
                      </Link>
                    </div>

                    {/* Procedure leaf links */}
                    {specExpanded && procs.map((p) => {
                      const isActive = pathname === `/procedures/${p.id}`
                      return (
                        <Link
                          key={p.id}
                          href={`/procedures/${p.id}`}
                          onClick={onNavigate}
                          className={`block pl-12 pr-3 py-1.5 text-sm transition-colors ${
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
        })}
      </div>
    </div>
  )
}
