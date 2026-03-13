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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#00B4D8]">
          <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:pt-3">
            <Link href="/" className="shrink-0 text-[#10243E]/70 transition-colors hover:text-[#10243E]">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-[18px] font-medium text-[#10243E] lg:text-base">New procedure card</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="mb-1 text-xl font-bold text-[#3F4752] lg:text-lg">What procedure is this card for?</p>
          <p className="mb-6 text-[15px] text-[#94a3b8] lg:text-sm">
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
              className="w-full rounded-xl border border-[#D5DCE3] bg-white py-3.5 pl-10 pr-4 text-[17px] text-[#3F4752] placeholder:text-[#cbd5e1] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] lg:text-base"
            />
          </div>

          {/* Fuzzy matches */}
          {matches.length > 0 && (
            <div className="bg-white rounded-xl border border-[#D5DCE3] overflow-hidden mb-4">
              <p className="border-b border-[#F4F7FA] px-4 py-2.5 text-[11px] uppercase tracking-wide text-[#94a3b8] lg:text-xs">
                Closest matches in registry
              </p>
              {matches.map(({ item }) => (
                <button
                  key={item.id}
                  onClick={() => { setSelected(item); setStep("confirm-existing") }}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors border-b border-[#F4F7FA] last:border-0 text-left"
                >
                  <div className="min-w-0 mr-3">
                    <p className="text-[15px] font-semibold leading-snug text-[#3F4752] lg:text-sm">{item.name}</p>
                    <p className="text-xs text-[#94a3b8] mt-0.5">{item.specialty} · {item.setting}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[13px] font-semibold text-[#4DA3FF] lg:text-xs">
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
                <p className="text-[15px] font-semibold text-[#4DA3FF] lg:text-sm">This is a completely new procedure</p>
                <p className="mt-0.5 text-[13px] text-[#94a3b8] lg:text-xs">
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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#00B4D8]">
          <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:pt-3">
            <button
              onClick={() => setStep("search")}
              className="shrink-0 text-[#10243E]/70 transition-colors hover:text-[#10243E]"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-[18px] font-medium text-[#10243E] lg:text-base">Confirm procedure</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="mb-4 text-[15px] text-[#94a3b8] lg:text-sm">
            Is this the procedure you&apos;re creating a card for?
          </p>

          <div className="bg-white rounded-xl border border-[#D5DCE3] px-4 py-4 mb-6">
            <p className="text-[17px] font-bold leading-snug text-[#3F4752] lg:text-base">{selected.name}</p>
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
              className="rounded-xl border border-[#D5DCE3] px-5 py-3 text-[15px] font-semibold text-[#64748b] transition-colors hover:bg-[#F4F7FA] lg:text-base"
            >
              Go back
            </button>
          </div>

          <button
            onClick={() => { setNewName(query.trim()); setStep("register-new") }}
            className="w-full text-center text-[15px] text-[#94a3b8] transition-colors hover:text-[#4DA3FF] lg:text-sm"
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
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#00B4D8]">
          <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:pt-3">
            <button
              onClick={() => setStep("search")}
              className="shrink-0 text-[#10243E]/70 transition-colors hover:text-[#10243E]"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-[18px] font-medium text-[#10243E] lg:text-base">Register new procedure</h1>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="mb-1 text-xl font-bold text-[#3F4752] lg:text-lg">New procedure details</p>
          <p className="mb-6 text-[15px] text-[#94a3b8] lg:text-sm">
            This adds the procedure to the registry and starts a blank card.
          </p>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-[#94a3b8] lg:text-xs">
                Procedure name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-[#D5DCE3] bg-white px-3 py-3 text-[17px] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] lg:text-base"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-[#94a3b8] lg:text-xs">
                Clinical setting
              </label>
              <select
                value={newSetting}
                onChange={(e) => setNewSetting(e.target.value as ClinicalSetting)}
                className="w-full rounded-xl border border-[#D5DCE3] bg-white px-3 py-3 text-[17px] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] lg:text-base"
              >
                <option value="">Select a setting…</option>
                {CLINICAL_SETTINGS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] uppercase tracking-wide text-[#94a3b8] lg:text-xs">
                Specialty
              </label>
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="e.g. Orthopaedics"
                list="specialty-options"
                className="w-full rounded-xl border border-[#D5DCE3] bg-white px-3 py-3 text-[17px] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] lg:text-base"
              />
              <datalist id="specialty-options">
                {existingSpecialties.map(s => <option key={s} value={s} />)}
              </datalist>
              <p className="mt-1.5 px-1 text-[13px] text-[#94a3b8] lg:text-xs">
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
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4DA3FF] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#2F8EF7] disabled:cursor-not-allowed disabled:opacity-40 lg:text-base"
          >
            <Plus size={16} /> Register &amp; start card
          </button>
        </main>
      </div>
    )
  }

  return null
}
