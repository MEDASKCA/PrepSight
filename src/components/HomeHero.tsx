"use client"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getProfile } from "@/lib/profile"
import { getHistory } from "@/lib/history"
import { procedures } from "@/lib/seed-data/index"
import { PrepSightProfile, USER_ROLE_LABEL } from "@/lib/types"
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

export default function HomeHero() {
  const [profile,    setProfile]    = useState<PrepSightProfile | null>(null)
  const [recentIds,  setRecentIds]  = useState<string[]>([])
  const [query,      setQuery]      = useState("")
  const [focused,    setFocused]    = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setProfile(getProfile())
    setRecentIds(getHistory())
  }, [])

  const results = query.trim().length > 1
    ? procedures.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialty.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  const recentProcedures = recentIds
    .map((id) => procedures.find((p) => p.id === id))
    .filter(Boolean) as typeof procedures

  const showResults = focused && query.trim().length > 1

  return (
    <div className="px-4 lg:px-8 py-8 lg:py-12 max-w-xl animate-step-in">

      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3F4752] mb-2.5">{getGreeting()}</h1>
        {profile && (
          <span className="inline-block text-xs font-semibold text-[#64748b] bg-white border border-[#D5DCE3] px-3 py-1.5 rounded-full">
            {getContextBadge(profile)}
          </span>
        )}
      </div>

      {/* Find a procedure — dominant card */}
      <div className="bg-[#4DA3FF] rounded-2xl p-5 mb-6">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">
          Find a procedure
        </p>
        <p className="text-white text-base font-semibold mb-4">
          Search by name or specialty.
        </p>

        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="e.g. Total knee replacement, Orthopaedics…"
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-colors"
          />
        </div>

        {/* Results dropdown */}
        {showResults && results.length > 0 && (
          <div className="mt-3 bg-white rounded-xl overflow-hidden">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/procedures/${p.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#F4F7FA] transition-colors border-b border-[#F4F7FA] last:border-0"
              >
                <div className="min-w-0 mr-3">
                  <p className="text-sm font-semibold text-[#3F4752] truncate">{p.name}</p>
                  <p className="text-xs text-[#94a3b8]">{p.specialty}</p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${SETTING_COLOUR[p.setting] ?? "bg-gray-100 text-gray-600"}`}>
                  {p.setting.split(" ")[0]}
                </span>
              </Link>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && (
          <p className="mt-3 text-sm text-white/40">No procedures found.</p>
        )}
      </div>

      {/* Recently viewed */}
      {recentProcedures.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Recently viewed
          </p>
          <div className="space-y-2">
            {recentProcedures.map((p) => (
              <Link
                key={p.id}
                href={`/procedures/${p.id}`}
                className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-[#D5DCE3] hover:border-[#4DA3FF] transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#3F4752]">{p.name}</p>
                  <p className="text-xs text-[#94a3b8]">{p.specialty}</p>
                </div>
                <ChevronRight size={14} className="text-[#D5DCE3] shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
