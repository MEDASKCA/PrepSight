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
    <div className="app-shell-bg min-h-screen">
      <header className="app-header-bg sticky top-0 z-30 border-b app-card-border lg:backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-start gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:max-w-none lg:px-12 lg:py-6">
          <HistoryBackButton
            fallbackHref="/"
            className="app-header-muted mt-0.5 shrink-0 transition-colors hover:opacity-80 lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6"
          />

          <div className="min-w-0 flex-1">
            <h1 className="app-header-text text-[18px] font-medium leading-snug lg:text-[42px] lg:font-semibold lg:tracking-[-0.05em]">
              {title ?? procedure.name}
            </h1>

            {subtitle && (
              <p className="app-header-muted mt-2 text-[15px] lg:text-xl lg:font-medium">{subtitle}</p>
            )}

            {tertiaryLabel && (
              <p className="app-header-muted mt-1 text-[15px] font-normal lg:text-lg">
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
                <span className="app-header-muted shrink-0 text-[11px] lg:text-xs">
                  Updated: {lastEdit.date}
                </span>
              )}
            </div>

            <div className="mt-0.5 flex items-baseline justify-between gap-2 lg:mt-2">
              <span className="app-header-muted text-[13px] lg:text-sm">{procedure.specialty}</span>
              {lastEdit && (
                <span className="app-header-muted shrink-0 text-[11px] lg:text-xs">
                  by: {lastEdit.by}
                </span>
              )}
            </div>
          </div>

          <Link
            href="/"
            className="app-header-muted mt-0.5 shrink-0 rounded-lg p-2 transition-colors hover:opacity-80 lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6 lg:hover:bg-white/10"
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
          <div className="app-card-bg app-card-border app-text-muted rounded-xl border border-dashed px-5 py-8 text-center text-sm lg:rounded-[28px]">
            No procedure card content available yet.
          </div>
        )}

        <footer className="app-card-border mt-6 border-t pt-4 lg:mt-10 lg:pt-6">
          <p className="app-text-muted text-[13px] lg:text-sm">
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
