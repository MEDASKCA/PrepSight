"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, ChevronRight, Plus, Check } from "lucide-react"
import Fuse from "fuse.js"
import { procedures } from "@/lib/seed-data/index"
import { CLINICAL_SETTINGS } from "@/lib/settings"
import { ClinicalSetting } from "@/lib/types"

type Step = "search" | "confirm-existing" | "register-new"
type Procedure = typeof procedures[0]

export default function NewCardPage() {
  const router = useRouter()

  const [query,        setQuery]        = useState("")
  const [step,         setStep]         = useState<Step>("search")
  const [selected,     setSelected]     = useState<Procedure | null>(null)
  const [newName,      setNewName]      = useState("")
  const [newSetting,   setNewSetting]   = useState<ClinicalSetting | "">("")
  const [newSpecialty, setNewSpecialty] = useState("")

  const fuse = useMemo(() => new Fuse(procedures, {
    keys: ["name"],
    threshold: 0.45,
    minMatchCharLength: 3,
    includeScore: true,
  }), [])

  const matches = useMemo(() => {
    if (query.trim().length < 3) return []
    return fuse.search(query.trim()).slice(0, 5)
  }, [query, fuse])

  const existingSpecialties = useMemo(() =>
    [...new Set(procedures.map(p => p.specialty))].sort()
  , [])

  // ── Step 1: Search ──────────────────────────────────────────────────────────
  if (step === "search") {
    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <header className="bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <Link href="/" className="text-white/60 hover:text-white transition-colors shrink-0">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-bold text-base text-white">New procedure card</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-lg font-bold text-[#3F4752] mb-1">What procedure is this card for?</p>
          <p className="text-sm text-[#94a3b8] mb-6">
            Type a name — we'll check if it already exists in the registry.
          </p>

          {/* Search input */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Total Hip Replacement…"
              autoFocus
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#D5DCE3] rounded-xl text-base text-[#3F4752] placeholder:text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent"
            />
          </div>

          {/* Fuzzy matches */}
          {matches.length > 0 && (
            <div className="bg-white rounded-xl border border-[#D5DCE3] overflow-hidden mb-4">
              <p className="px-4 py-2.5 text-xs uppercase tracking-wide text-[#94a3b8] border-b border-[#F4F7FA]">
                Closest matches in registry
              </p>
              {matches.map(({ item }) => (
                <button
                  key={item.id}
                  onClick={() => { setSelected(item); setStep("confirm-existing") }}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors border-b border-[#F4F7FA] last:border-0 text-left"
                >
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-semibold text-[#3F4752] leading-snug">{item.name}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{item.specialty} · {item.setting}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#4DA3FF] flex items-center gap-0.5 whitespace-nowrap">
                    Use this <ChevronRight size={13} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* New procedure option */}
          {query.trim().length >= 3 && (
            <button
              onClick={() => { setNewName(query.trim()); setStep("register-new") }}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-white border border-dashed border-[#4DA3FF] rounded-xl hover:bg-[#EFF8FF] transition-colors text-left"
            >
              <div className="min-w-0 mr-3">
                <p className="text-sm font-semibold text-[#4DA3FF]">This is a completely new procedure</p>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Add &ldquo;{query.trim()}&rdquo; to the registry and start a blank card
                </p>
              </div>
              <Plus size={16} className="text-[#4DA3FF] shrink-0" />
            </button>
          )}
        </main>
      </div>
    )
  }

  // ── Step 2a: Confirm existing ───────────────────────────────────────────────
  if (step === "confirm-existing" && selected) {
    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <header className="bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setStep("search")}
              className="text-white/60 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-base text-white">Confirm procedure</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-sm text-[#94a3b8] mb-4">
            Is this the procedure you&apos;re creating a card for?
          </p>

          <div className="bg-white rounded-xl border border-[#D5DCE3] px-4 py-4 mb-6">
            <p className="font-bold text-[#3F4752] text-base leading-snug">{selected.name}</p>
            <p className="text-xs text-[#94a3b8] mt-1.5">{selected.specialty} · {selected.setting}</p>
          </div>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => router.push(`/procedures/${selected.id}`)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#4DA3FF] text-white font-semibold py-3 rounded-xl hover:bg-[#2F8EF7] transition-colors"
            >
              <Check size={16} /> Yes, create card
            </button>
            <button
              onClick={() => setStep("search")}
              className="px-5 py-3 rounded-xl border border-[#D5DCE3] text-[#64748b] font-semibold hover:bg-[#F4F7FA] transition-colors"
            >
              Go back
            </button>
          </div>

          <button
            onClick={() => { setNewName(query.trim()); setStep("register-new") }}
            className="w-full text-sm text-[#94a3b8] hover:text-[#4DA3FF] transition-colors text-center"
          >
            No — &ldquo;{query}&rdquo; is a different procedure →
          </button>
        </main>
      </div>
    )
  }

  // ── Step 2b: Register new procedure ────────────────────────────────────────
  if (step === "register-new") {
    const canSubmit = newName.trim() && newSetting && newSpecialty.trim()

    return (
      <div className="min-h-screen bg-[#F4F7FA]">
        <header className="bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => setStep("search")}
              className="text-white/60 hover:text-white transition-colors shrink-0"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-base text-white">Register new procedure</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-lg font-bold text-[#3F4752] mb-1">New procedure details</p>
          <p className="text-sm text-[#94a3b8] mb-6">
            This adds the procedure to the registry and starts a blank card.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">
                Procedure name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent bg-white"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">
                Clinical setting
              </label>
              <select
                value={newSetting}
                onChange={(e) => setNewSetting(e.target.value as ClinicalSetting)}
                className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent bg-white"
              >
                <option value="">Select a setting…</option>
                {CLINICAL_SETTINGS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">
                Specialty
              </label>
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="e.g. Orthopaedics"
                list="specialty-options"
                className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent bg-white"
              />
              <datalist id="specialty-options">
                {existingSpecialties.map(s => <option key={s} value={s} />)}
              </datalist>
              <p className="text-xs text-[#94a3b8] mt-1.5 px-1">
                Start typing — existing specialties will appear as suggestions.
              </p>
            </div>
          </div>

          <button
            disabled={!canSubmit}
            onClick={() => {
              // TODO: write to Firestore proposed_procedures collection
              // TODO: create blank Kardex card linked to new procedure
              router.push("/")
            }}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-[#4DA3FF] text-white font-semibold py-3.5 rounded-xl hover:bg-[#2F8EF7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Register &amp; start card
          </button>
        </main>
      </div>
    )
  }

  return null
}
