"use client"

import { useRef, useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { procedures } from "@/lib/data"
import { getHistory } from "@/lib/history"
import { getProfile, getRelevantSettings } from "@/lib/profile"
import { getProcedureVariantById, getSystemById } from "@/lib/variants"
import {
  ClinicalSetting,
  PrepSightProfile,
  USER_ROLE_LABEL,
} from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning."
  if (h < 17) return "Good afternoon."
  return "Good evening."
}

function getContextBadge(profile: PrepSightProfile): string {
  const parts: string[] = [USER_ROLE_LABEL[profile.role] ?? profile.role]
  if (profile.departments[0]) parts.push(profile.departments[0])
  if (profile.specialtiesOfInterest[0]) parts.push(profile.specialtiesOfInterest[0])
  return parts.join(" · ")
}

function formatRecentSubtitle(procedureName: string, variantName?: string | null): string {
  return variantName ? `${procedureName} ${variantName}` : procedureName
}

export default function HomeHero() {
  const [profile] = useState<PrepSightProfile | null>(() => getProfile())
  const [recentEntries] = useState<ReturnType<typeof getHistory>>(() => getHistory())
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [relevantSettings] = useState<ClinicalSetting[]>(() =>
    profile ? getRelevantSettings(profile) : [],
  )
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim().length > 1
    ? procedures.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialty.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 8)
    : []

  const recentCards = recentEntries
    .map((entry) => {
      const procedure = procedures.find((p) => p.id === entry.procedureId)
      if (!procedure) return null

      const variant = entry.variantId
        ? getProcedureVariantById(entry.variantId)
        : null
      const system = entry.systemId
        ? getSystemById(entry.systemId)
        : null

      return {
        entry,
        procedure,
        variant,
        system,
        href:
          entry.variantId && entry.systemId
            ? `/procedures/${procedure.id}?variant=${encodeURIComponent(entry.variantId)}&system=${encodeURIComponent(entry.systemId)}`
          : `/procedures/${procedure.id}`,
      }
    })
    .filter(
      (
        card,
      ): card is {
        entry: (typeof recentEntries)[number]
        procedure: (typeof procedures)[number]
        variant: ReturnType<typeof getProcedureVariantById>
        system: ReturnType<typeof getSystemById>
        href: string
      } => card !== null,
    )

  const showResults = focused && query.trim().length > 1

  return (
    <div className="max-w-xl animate-step-in px-4 py-8 lg:px-8 lg:py-12">
      <div className="mb-8">
        <h1 className="mb-2.5 text-2xl font-bold text-[#3F4752]">
          {getGreeting()}
        </h1>
        {profile && (
          <span className="inline-block rounded-full border border-[#D5DCE3] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748b]">
            {getContextBadge(profile)}
          </span>
        )}
      </div>

      <div className="mb-6 overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white shadow-sm">
        <div className="bg-[#1E293B] px-5 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/50">
            Find a procedure
          </p>
          <p className="text-base font-semibold text-white">
            Search by name or specialty.
          </p>
        </div>

        <div className="p-5">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="e.g. Total knee replacement, Orthopaedics..."
              className="w-full rounded-xl border border-[#D5DCE3] bg-[#F8FBFF] py-3 pl-10 pr-4 text-sm text-[#3F4752] placeholder-[#94a3b8] transition-colors focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#CFE6FF]"
            />
          </div>
        </div>

        {showResults && results.length > 0 && (
          <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-[#D5DCE3] bg-white">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/procedures/${p.id}`}
                className="flex items-center justify-between border-b border-[#F4F7FA] px-4 py-3 transition-colors last:border-0 hover:bg-[#F4F7FA]"
              >
                <div className="mr-3 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3F4752]">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#94a3b8]">{p.specialty}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SETTING_COLOUR[p.setting] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {p.setting.split(" ")[0]}
                </span>
              </Link>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && (
          <p className="mx-5 mb-5 text-sm text-[#94a3b8]">No procedures found.</p>
        )}
      </div>

      {relevantSettings.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Your areas
          </p>
          <div className="space-y-2">
            {relevantSettings.map((setting) => {
              const count = procedures.filter((p) => p.setting === setting).length
              if (count === 0) return null

              return (
                <Link
                  key={setting}
                  href={`/?setting=${encodeURIComponent(setting)}`}
                  className="flex items-center justify-between rounded-xl bg-[#4DA3FF] px-4 py-3.5 transition-colors hover:bg-[#2F8EF7]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{setting}</p>
                    <p className="mt-0.5 text-xs text-white/75">
                      {count} {count === 1 ? "procedure" : "procedures"}
                    </p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white/80">
                      {setting.split(" ")[0]}
                    </span>
                    <ChevronRight size={14} className="text-white/80" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {recentCards.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Recently viewed
          </p>
          <div className="space-y-2">
            {recentCards.map((card) => (
              <Link
                key={`${card.entry.procedureId}-${card.entry.variantId ?? "base"}-${card.entry.systemId ?? "base"}`}
                href={card.href}
                className="flex items-center justify-between rounded-xl border px-4 py-3.5 shadow-sm transition-colors"
                style={{
                  backgroundColor: "#C7ECE8",
                  borderColor: "#9EDDD6",
                }}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#134E4A]">
                    {card.system?.name ?? card.procedure.name}
                  </p>
                  <p className="text-xs text-[#0F766E]">
                    {formatRecentSubtitle(
                      card.procedure.name,
                      card.variant?.name,
                    )}
                  </p>
                </div>
                <ChevronRight size={14} className="shrink-0 text-[#0F766E]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
