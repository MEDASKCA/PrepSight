"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { House } from "lucide-react"
import KardexSection from "./KardexSection"
import ChecklistPanel from "./ChecklistPanel"
import HistoryBackButton from "./HistoryBackButton"
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
    <div className="min-h-screen bg-[#F4F7FA] lg:bg-[#06111D]">
      <div className="hidden lg:block lg:fixed lg:inset-0 lg:pointer-events-none lg:bg-[radial-gradient(circle_at_top_left,_rgba(77,163,255,0.14),_transparent_24%),radial-gradient(circle_at_88%_14%,_rgba(20,184,166,0.1),_transparent_18%),linear-gradient(145deg,#06111D_0%,#091725_48%,#0B2134_100%)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#00B4D8] lg:bg-[#08131F]/88 lg:backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-start gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:max-w-none lg:px-12 lg:py-6">
          <HistoryBackButton
            fallbackHref="/"
            className="mt-0.5 shrink-0 text-[#10243E]/70 transition-colors hover:text-[#10243E] lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6 lg:text-white/60 lg:hover:text-white"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-[18px] font-medium leading-snug text-[#10243E] lg:text-[42px] lg:font-semibold lg:tracking-[-0.05em] lg:text-white">
              {title ?? procedure.name}
            </h1>

            {subtitle && (
              <p className="mt-2 text-[15px] text-[#10243E]/68 lg:text-xl lg:font-medium lg:text-white/72">{subtitle}</p>
            )}

            {tertiaryLabel && (
              <p className="mt-1 text-[15px] font-normal text-[#10243E]/68 lg:text-lg lg:text-white/52">
                {tertiaryLabel}
              </p>
            )}

            <div className="mt-3 flex items-baseline justify-between gap-2 lg:mt-4">
              <span
                className={`rounded-full px-2 py-0.5 text-[13px] font-semibold ${settingColour} lg:px-4 lg:py-1.5 lg:text-[11px] lg:uppercase lg:tracking-[0.16em]`}
              >
                {procedure.setting}
              </span>
              {lastEdit && (
                <span className="shrink-0 text-[11px] text-[#10243E]/52 lg:text-xs lg:text-white/40">
                  Updated: {lastEdit.date}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-baseline justify-between gap-2 lg:mt-2">
              <span className="text-[13px] text-[#10243E]/52 lg:text-sm lg:text-white/52">{procedure.specialty}</span>
              {lastEdit && (
                <span className="shrink-0 text-[11px] text-[#10243E]/52 lg:text-xs lg:text-white/40">
                  by: {lastEdit.by}
                </span>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="mt-0.5 shrink-0 rounded-lg p-2 text-[#10243E]/70 transition-colors hover:bg-[#10243E]/8 hover:text-[#10243E] lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6 lg:text-white/60 lg:hover:bg-white/10 lg:hover:text-white"
            aria-label="Home"
          >
            <House size={18} />
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl select-none px-4 py-4 lg:max-w-none lg:px-12 lg:py-10">
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
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center text-sm text-slate-400 lg:rounded-[28px] lg:border-white/10 lg:bg-white/6 lg:text-white/56">
            No procedure card content available yet.
          </div>
        )}

        <footer className="mt-6 border-t border-[#D5DCE3] pt-4 lg:mt-10 lg:border-white/10 lg:pt-6">
          <p className="text-[13px] text-[#94a3b8] lg:text-sm lg:text-white/42">
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
