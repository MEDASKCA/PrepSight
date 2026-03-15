"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { House } from "lucide-react"
import KardexSection from "./KardexSection"
import CollectionPanel from "./CollectionPanel"
import HistoryBackButton from "./HistoryBackButton"
import { Procedure, Section } from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"
import { getProfile } from "@/lib/profile"
import { getCardCustomSections, saveCardCustomSections } from "@/lib/firestore"
import { onAuthChange } from "@/lib/auth"

type PageMode = "browse" | "collection"

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
  implantSystem?: string
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
  implantSystem,
}: Props) {
  const [lastEdit, setLastEdit] = useState<LastEdit | null>(null)
  const [sectionsState, setSectionsState] = useState<Section[]>(cardSections)
  const [uid, setUid] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [mode, setMode] = useState<PageMode>("browse")
  const [isDark, setIsDark] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [activeSection, setActiveSection] = useState<string>("")
  const [isDesktop, setIsDesktop] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sync = () => setIsDark(document.documentElement.dataset.theme === "dark")
    sync()
    window.addEventListener("prepsight:preferences-changed", sync as EventListener)
    return () => window.removeEventListener("prepsight:preferences-changed", sync as EventListener)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Active TOC section on scroll
  useEffect(() => {
    if (!isDesktop || sectionsState.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    )
    sectionsState.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isDesktop, sectionsState])

  function toggleItem(itemId: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
      return next
    })
  }

  function handleModeChange(next: PageMode) {
    setMode(next)
    if (next === "browse") setCheckedItems(new Set())
  }

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
      <header data-dev-trigger className="app-header-bg sticky top-0 z-30 border-b app-card-border lg:backdrop-blur-2xl">
        <div className="mx-auto flex max-w-none items-start gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:px-12 lg:py-6">
          <HistoryBackButton
            fallbackHref="/"
            className="app-header-muted mt-0.5 shrink-0 transition-colors hover:opacity-80 lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6"
          />

          <div className="min-w-0 flex-1">
            {/* Procedure name */}
            <h1 className="app-header-text text-[18px] font-semibold leading-snug lg:text-[38px] lg:tracking-[-0.04em]">
              {title ?? procedure.name}
            </h1>

            {/* Variant · System — single muted line */}
            {(subtitle || tertiaryLabel) && (
              <p className="app-header-muted mt-1 text-[13px] leading-snug lg:text-[17px] lg:mt-2">
                {[subtitle, tertiaryLabel].filter(Boolean).join(" · ")}
              </p>
            )}

            {/* Setting badge + specialty + last edit — all one row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${settingColour}`}>
                {procedure.setting}
              </span>
              <span className="app-header-muted text-[11px]">·</span>
              <span className="app-header-muted text-[11px] lg:text-xs">{procedure.specialty}</span>
              {lastEdit && (
                <>
                  <span className="app-header-muted text-[11px]">·</span>
                  <span className="app-header-muted text-[11px] lg:text-xs">
                    Updated {lastEdit.date} by {lastEdit.by}
                  </span>
                </>
              )}
            </div>

            {/* Mode toggle */}
            <div className="mt-2.5 flex gap-1 rounded-xl bg-black/5 p-1 w-fit">
              {(["browse", "collection"] as PageMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleModeChange(m)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    mode === m
                      ? "bg-white text-[#10243E] shadow-sm"
                      : "text-[#64748b] hover:text-[#10243E]"
                  }`}
                >
                  {m === "browse" ? "Browse & Update" : "Collection"}
                </button>
              ))}
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

      <main className="relative mx-auto max-w-none select-none">
        {hasSections ? (
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:items-start">

            {/* ── Desktop sticky TOC ───────────────────────────────────── */}
            <nav className="hidden lg:block lg:sticky lg:top-[100px] lg:self-start lg:py-8 lg:pl-10 lg:pr-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                Sections
              </p>
              <ul className="space-y-0.5">
                {sectionsState.map((s) => {
                  const isActive = activeSection === `section-${s.id}`
                  return (
                    <li key={s.id}>
                      <a
                        href={`#section-${s.id}`}
                        onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                        }}
                        className={`block rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all ${
                          isActive
                            ? "bg-white/12 text-white"
                            : "text-white/45 hover:bg-white/6 hover:text-white/80"
                        }`}
                      >
                        {s.title}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* ── Section content ──────────────────────────────────────── */}
            <div ref={contentRef} className="lg:border-l lg:border-white/8 lg:py-6">
            {sectionsState.map((section) => (
              <KardexSection
                key={`${section.id}:${section.items.length}:${section.nurseNotes ?? ""}:${section.patientPositionInstructions ?? ""}:${section.externalLinks?.length ?? 0}`}
                section={section}
                anchorId={`section-${section.id}`}
                defaultOpen={isDesktop}
                showChecks={mode === "collection"}
                checkedItems={checkedItems}
                onItemCheck={toggleItem}
                implantSystem={implantSystem ?? procedure.implantSystem}
                procedureId={procedure.id}
                procedureName={procedure.name}
                uid={uid}
                onSave={handleSectionSave}
                onSectionChange={handleSectionChange}
              />
            ))}

            {mode === "collection" && (
              <CollectionPanel
                sections={sectionsState}
                checkedItems={checkedItems}
                procedureId={procedure.id}
                procedureName={procedure.name}
                variantName={subtitle}
                uid={uid}
                isDark={isDark}
              />
            )}

            <footer className="app-card-border mt-6 border-t px-4 pt-4 lg:mt-8 lg:px-7 lg:pt-6">
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
            </div>
          </div>
        ) : (
          <div className="app-card-bg app-card-border app-text-muted mx-4 rounded-xl border border-dashed px-5 py-8 text-center text-sm lg:mx-0 lg:rounded-[28px]">
            No procedure card content available yet.
          </div>
        )}
      </main>
    </div>
  )
}
