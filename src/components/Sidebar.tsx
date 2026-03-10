"use client"

import { useMemo, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Activity,
  BedSingle,
  Building2,
  ChevronRight,
  HeartPulse,
  Package,
  Pill,
  Search,
  Stethoscope,
  Waves,
} from "lucide-react"
import { procedures } from "@/lib/seed-data/index"
import { getProcedureById } from "@/lib/data"
import { surgeons as surgeonList, getSurgeonLibrary } from "@/lib/surgeons"
import { CLINICAL_SETTINGS, SETTING_SPECIALTIES } from "@/lib/settings"
import { ClinicalSetting, Procedure, USER_ROLE_LABEL } from "@/lib/types"
import { getProfile } from "@/lib/profile"
import { canonicalSpecialtyName } from "@/lib/specialty-normalization"

type ViewMode = "setting" | "surgeon" | "supplier"

const TAB_ACTIVE = "bg-[#4DA3FF] text-white shadow-sm"
const TAB_IDLE = "text-slate-600 hover:bg-slate-100"
const SETTING_TILE_ACTIVE = "border-[#7CC6FF] bg-gradient-to-br from-[#EFF8FF] via-white to-[#E8F7FF] shadow-sm"
const SETTING_TILE_IDLE = "border-slate-200 bg-white hover:border-[#B8DBFF] hover:bg-slate-50"
const SETTING_ICON_MAP = {
  "Operating Theatre": Stethoscope,
  "Endoscopy Suite": Waves,
  "Interventional Radiology / Cath Lab": Activity,
  "Emergency Department": HeartPulse,
  "Intensive Care Unit": BedSingle,
  "Ward": Building2,
  "Outpatient / Clinic": Pill,
  "Maternity & Obstetrics": HeartPulse,
} satisfies Record<ClinicalSetting, typeof Waves>

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeSetting = searchParams.get("setting")

  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("setting")
  const [selectedSurgeon, setSelectedSurgeon] = useState<string | null>(null)

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

  return (
    <div className="flex h-full">
      <div className="w-72 shrink-0 flex flex-col h-full border-r border-slate-200 bg-white">
        <div data-dev-trigger className="px-4 py-4 border-b border-slate-200 shrink-0">
          <div className="mb-3 flex items-center gap-2">
            <Image src="/ps-mark.png" alt="PrepSight" width={48} height={28} className="h-7 w-auto" />
            <span className="text-base font-bold tracking-tight text-cyan-500">PrepSight</span>
          </div>
          {profile && (
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500">
                <span className="text-xs font-bold text-white">{profile.role[0].toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">
                  {USER_ROLE_LABEL[profile.role] ?? profile.role}
                </p>
                {profile.departments[0] && (
                  <p className="truncate text-xs text-slate-400">{profile.departments[0]}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 px-3 pt-3">
          <Link
            href="/procedures/new"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-sky-300 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50"
          >
            <span className="text-base leading-none">+</span> New procedure card
          </Link>
        </div>

        <div className="shrink-0 border-b border-slate-200 px-3 py-3">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>

        <div className="shrink-0 border-b border-slate-200 px-3 py-2">
          <div className="flex gap-1">
            <button
              onClick={() => setViewMode("setting")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${viewMode === "setting" ? TAB_ACTIVE : TAB_IDLE}`}
            >
              Setting
            </button>
            <button
              onClick={() => setViewMode("surgeon")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${viewMode === "surgeon" ? TAB_ACTIVE : TAB_IDLE}`}
            >
              Surgeon
            </button>
            <button
              onClick={() => setViewMode("supplier")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${viewMode === "supplier" ? TAB_ACTIVE : TAB_IDLE}`}
            >
              Supplier
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {viewMode === "setting" && (
            <div className="space-y-2 px-2">
              {Array.from(filteredTree.entries()).map(([setting, specMap]) => {
                const isActive = activeSetting === setting
                const SettingIcon = SETTING_ICON_MAP[setting] ?? Package
                return (
                  <Link
                    key={setting}
                    href={`/?setting=${encodeURIComponent(setting)}`}
                    className={`group flex min-h-16 w-full items-start gap-3 rounded-2xl border px-3 py-3 text-left transition-all ${
                      isActive ? SETTING_TILE_ACTIVE : SETTING_TILE_IDLE
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                        isActive
                          ? "border-[#A7D8FF] bg-[#DFF2FF] text-[#1D8DCC]"
                          : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-[#B8DBFF] group-hover:text-[#1D8DCC]"
                      }`}
                    >
                      <SettingIcon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-slate-800">{setting}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {specMap.size} {specMap.size === 1 ? "specialty" : "specialties"}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className={`mt-1 shrink-0 ${isActive ? "text-sky-500" : "text-slate-400 group-hover:text-sky-500"}`}
                    />
                  </Link>
                )
              })}
              {filteredTree.size === 0 && (
                <p className="px-2 py-4 text-sm text-slate-400">No results.</p>
              )}
            </div>
          )}

          {viewMode === "surgeon" && (
            <div className="space-y-1 px-2">
              {Array.from(filteredSurgeonTree.entries()).map(([surgeon, procs]) => {
                const isSelected = selectedSurgeon === surgeon
                return (
                  <div key={surgeon} className="overflow-hidden rounded-xl border border-slate-200">
                    <button
                      onClick={() => setSelectedSurgeon(isSelected ? null : surgeon)}
                      className={`flex min-h-11 w-full items-center gap-2 px-3 text-left transition-all ${
                        isSelected ? "bg-slate-100 text-slate-900 shadow-sm" : "bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex-1 truncate text-sm font-semibold">{surgeon}</span>
                      <span className={`text-[11px] tabular-nums ${isSelected ? "text-slate-500" : "text-slate-400"}`}>
                        {procs.length}
                      </span>
                      <ChevronRight
                        size={13}
                        className={`transition-transform ${isSelected ? "rotate-90 text-slate-500" : "text-slate-400"}`}
                      />
                    </button>
                    {isSelected && (
                      <div className="border-t border-slate-200 bg-slate-50 px-2 py-2">
                        {procs.map((p) => {
                          const isActive = pathname === `/procedures/${p.id}`
                          return (
                            <Link
                              key={p.id}
                              href={`/procedures/${p.id}`}
                              className={`mb-1 flex items-center rounded-lg px-3 py-2 text-sm transition-colors last:mb-0 ${
                                isActive
                                  ? "border border-sky-100 bg-sky-50 font-semibold text-sky-700"
                                  : "text-slate-600 hover:bg-white hover:text-sky-700"
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
                <p className="px-2 py-4 text-sm text-slate-400">Surgeons will appear here once added to procedure cards.</p>
              )}
            </div>
          )}

          {viewMode === "supplier" && (
            <div className="space-y-3 px-2 py-1">
              <Link
                href="/catalogue"
                className={`block rounded-2xl border px-4 py-4 transition-all ${
                  pathname === "/catalogue"
                    ? "border-[#7CC6FF] bg-gradient-to-br from-[#EAF7FF] via-white to-[#E9FBFF] shadow-sm"
                    : "border-slate-200 bg-white hover:border-[#B8DBFF] hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#A7D8FF] bg-[#DFF2FF] text-[#1596AE]">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">Catalogue</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Supplier products, implants, trays, consumables, equipment, and sizing.
                    </p>
                  </div>
                  <ChevronRight size={14} className="mt-1 shrink-0 text-slate-400" />
                </div>
              </Link>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Supplier View
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This tab is now the catalogue home. Fixed supplier trays, implants, and product banks live there.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-slate-200 px-4 py-2.5">
          <p className="text-xs text-slate-400">PrepSight · v0.4</p>
        </div>
      </div>
    </div>
  )
}
