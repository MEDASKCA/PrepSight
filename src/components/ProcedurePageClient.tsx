"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, House } from "lucide-react"
import KardexSection from "./KardexSection"
import ChecklistPanel from "./ChecklistPanel"
import { Procedure, Section } from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"
import { getProfile } from "@/lib/profile"
import { getCardCustomSections, saveCardCustomSections } from "@/lib/firestore"
import { onAuthChange } from "@/lib/auth"

interface LastEdit {
  date: string
  by: string
}

interface Props {
  procedure: Procedure
  cardSections: Section[]
  cardKey: string
  title?: string
  subtitle?: string
  tertiaryLabel?: string
}

function formatName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length < 2) return parts[0]
  return `${parts[0][0]}. ${parts[parts.length - 1]}`
}

function today(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ProcedurePageClient({
  procedure,
  cardSections,
  cardKey,
  title,
  subtitle,
  tertiaryLabel,
}: Props) {
  const [lastEdit, setLastEdit] = useState<LastEdit | null>(null)
  const [sectionsState, setSectionsState] = useState<Section[]>(cardSections)
  const [uid, setUid] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const settingColour =
    SETTING_COLOUR[procedure.setting] ?? "bg-gray-100 text-gray-700"
  const hasSections = sectionsState.length > 0

  useEffect(() => onAuthChange((user) => setUid(user?.uid ?? null)), [])

  useEffect(() => {
    setSectionsState(cardSections)
  }, [cardSections])

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!uid) return
      const customSections = await getCardCustomSections(uid, cardKey)
      if (cancelled || customSections.length === 0) return
      setSectionsState((current) =>
        current.map((section) => {
          if (section.contentMode === "fixed") return section
          const override = customSections.find((item) => item.id === section.id)
          return override ?? section
        }),
      )
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [cardKey, uid])

  function handleSectionSave() {
    const profile = getProfile()
    const by = profile?.name ? formatName(profile.name) : "You"
    setLastEdit({ date: today(), by })
  }

  function handleSectionChange(updatedSection: Section) {
    setSectionsState((current) => {
      const next = current.map((section) =>
        section.id === updatedSection.id ? updatedSection : section,
      )

      if (uid) {
        const editableSections = next.filter(
          (section) => section.contentMode !== "fixed",
        )
        startTransition(() => {
          void saveCardCustomSections(uid, cardKey, editableSections)
        })
      }

      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1E293B]">
        <div className="mx-auto flex max-w-4xl items-start gap-3 px-4 py-3">
          <Link
            href="/"
            className="mt-0.5 shrink-0 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-snug text-white">
              {title ?? procedure.name}
            </h1>

            {subtitle && (
              <p className="mt-0.5 text-sm text-white/60">{subtitle}</p>
            )}

            {tertiaryLabel && (
              <p className="mt-0.5 text-sm font-medium text-white/60">
                {tertiaryLabel}
              </p>
            )}

            <div className="mt-1.5 flex items-baseline justify-between gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${settingColour}`}
              >
                {procedure.setting}
              </span>
              {lastEdit && (
                <span className="shrink-0 text-[10px] text-white/40">
                  Updated: {lastEdit.date}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <span className="text-xs text-white/40">{procedure.specialty}</span>
              {lastEdit && (
                <span className="shrink-0 text-[10px] text-white/40">
                  by: {lastEdit.by}
                </span>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="mt-0.5 shrink-0 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Home"
          >
            <House size={18} />
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl select-none px-4 py-4">
        {hasSections ? (
          <>
            <ChecklistPanel cardKey={cardKey} sections={sectionsState} />
            {sectionsState.map((section) => (
              <KardexSection
                key={`${section.id}:${section.items.length}:${section.nurseNotes ?? ""}:${section.patientPositionInstructions ?? ""}:${section.externalLinks?.length ?? 0}`}
                section={section}
                defaultOpen={false}
                onSave={handleSectionSave}
                onSectionChange={handleSectionChange}
              />
            ))}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-400">
            No procedure card content available yet.
          </div>
        )}

        <footer className="mt-6 border-t border-[#D5DCE3] pt-4">
          <p className="text-xs text-[#94a3b8]">
            {procedure.updatedAt
              ? `Reviewed ${new Date(procedure.updatedAt).toLocaleDateString("en-GB", {
                  month: "long",
                  year: "numeric",
                })} · `
              : "Reviewed periodically · "}
            PrepSight editorial · Local policy applies
          </p>
        </footer>
      </main>
    </div>
  )
}
