import { procedures, getProceduresBySpecialty } from "@/lib/data"
import { ClinicalSetting, Procedure } from "@/lib/types"
import { SETTING_COLOUR, SETTING_SPECIALTIES } from "@/lib/settings"
import { House } from "lucide-react"
import Link from "next/link"
import HomeHero from "@/components/HomeHero"
import OperatingTheatreTabs from "@/components/OperatingTheatreTabs"
import ProcedureTabs from "@/components/ProcedureTabs"
import HistoryBackButton from "@/components/HistoryBackButton"
import {
  getOperatingTheatreSpecialtyIdByLabel,
  getServiceLinesForSpecialty,
  getServiceLineNameById,
  getAnatomyNameById,
  getDescendantAnatomyIds,
} from "@/lib/operating-theatre-taxonomy"
import { hasVariantsForProcedure } from "@/lib/variants"

const SPECIALTY_PAGE_COLOURS = [
  { header: "#3B82F6", hover: "#2563EB", soft: "#DBEAFE", softBorder: "#93C5FD", softText: "#1D4ED8" },
  { header: "#14B8A6", hover: "#0F766E", soft: "#CCFBF1", softBorder: "#5EEAD4", softText: "#0F766E" },
  { header: "#7C5CFC", hover: "#6D28D9", soft: "#EDE9FE", softBorder: "#C4B5FD", softText: "#6D28D9" },
  { header: "#F97316", hover: "#EA580C", soft: "#FFEDD5", softBorder: "#FDBA74", softText: "#C2410C" },
  { header: "#2563EB", hover: "#1D4ED8", soft: "#DBEAFE", softBorder: "#93C5FD", softText: "#1D4ED8" },
  { header: "#10B981", hover: "#059669", soft: "#D1FAE5", softBorder: "#6EE7B7", softText: "#047857" },
]

interface Props {
  searchParams: Promise<{
    setting?: string
    specialty?: string
    service_line?: string
    anatomy?: string
    procedure?: string
    procedure_variant?: string
    system?: string
  }>
}

function normalizeText(value?: string) {
  return (value ?? "").trim().toLowerCase()
}

function dedupeProceduresForDisplay(list: Procedure[]): Procedure[] {
  const grouped = new Map<string, Procedure[]>()

  for (const procedure of list) {
    const key = [
      normalizeText(procedure.name),
      normalizeText("service_line_id" in procedure ? String(procedure.service_line_id) : ""),
      normalizeText("anatomy_id" in procedure ? String(procedure.anatomy_id) : ""),
    ].join("|")
    const rows = grouped.get(key) ?? []
    rows.push(procedure)
    grouped.set(key, rows)
  }

  return Array.from(grouped.values()).map((candidates) => {
    const withVariants = candidates.find((row) => hasVariantsForProcedure(row.id))
    const withSections = candidates.find((row) => row.sections.length > 0)
    return withVariants ?? withSections ?? candidates[0]
  })
}

export default async function HomePage({ searchParams }: Props) {
  const { setting, specialty, service_line, anatomy, system } =
    await searchParams

  if (!setting) {
    return <HomeHero />
  }

  const activeSetting = setting as ClinicalSetting
  const activeSpecialty = specialty
  const isOperatingTheatre = activeSetting === "Operating Theatre"

  const isSettingOverview = !activeSpecialty
  const isOperatingTheatreOverviewPage = isOperatingTheatre && !activeSpecialty
  const isOperatingTheatreSpecialtyPage = isOperatingTheatre && !!activeSpecialty && !anatomy
  const isAnatomyPage = isOperatingTheatre && !!activeSpecialty && !!anatomy

  if (isSettingOverview) {
    return <HomeHero initialWorkspace={activeSetting} />
  }

  const settingColour =
    SETTING_COLOUR[activeSetting] ?? "bg-gray-100 text-gray-700"

  const operatingTheatreTabs = isOperatingTheatre
    ? SETTING_SPECIALTIES["Operating Theatre"]
      .filter((spec) => !activeSpecialty || spec === activeSpecialty)
      .map((spec) => {
        const specId = getOperatingTheatreSpecialtyIdByLabel(spec)
        const serviceLines = specId ? getServiceLinesForSpecialty(specId) : []
        const palette =
          SPECIALTY_PAGE_COLOURS[
            SETTING_SPECIALTIES["Operating Theatre"].indexOf(spec) % SPECIALTY_PAGE_COLOURS.length
          ] ?? SPECIALTY_PAGE_COLOURS[0]

        return {
          name: spec,
          subspecialtyCount: serviceLines.length,
          serviceLines,
          palette,
        }
      })
    : []

  const serviceLineLabel = service_line
    ? getServiceLineNameById(service_line) ?? service_line
    : undefined

  const anatomyLabel = anatomy
    ? getAnatomyNameById(anatomy) ?? anatomy
    : undefined

  const activeSpecialtyPalette = activeSpecialty
    ? SPECIALTY_PAGE_COLOURS[
        SETTING_SPECIALTIES["Operating Theatre"].indexOf(activeSpecialty) % SPECIALTY_PAGE_COLOURS.length
      ] ?? SPECIALTY_PAGE_COLOURS[0]
    : SPECIALTY_PAGE_COLOURS[0]

  let theatreProcedures: Procedure[] = procedures

  if (isOperatingTheatre && activeSpecialty) {
    theatreProcedures = getProceduresBySpecialty(activeSetting, activeSpecialty)

    if (service_line) {
      theatreProcedures = theatreProcedures.filter(
        (p) => "service_line_id" in p && p.service_line_id === service_line,
      )
    }

    if (anatomy) {
      const allowedAnatomyIds = new Set([
        anatomy,
        ...getDescendantAnatomyIds(anatomy),
      ])

      theatreProcedures = theatreProcedures.filter((p) => {
        if (!("anatomy_id" in p) || typeof p.anatomy_id !== "string") {
          return false
        }
        return allowedAnatomyIds.has(p.anatomy_id)
      })
    }

    theatreProcedures = dedupeProceduresForDisplay(
      theatreProcedures.filter(
        (p) => hasVariantsForProcedure(p.id) || p.sections.length > 0,
      ),
    )
  }

  const backHref = anatomy
    ? `/?setting=${encodeURIComponent(activeSetting)}&specialty=${encodeURIComponent(
        activeSpecialty!,
      )}${service_line ? `&service_line=${encodeURIComponent(service_line)}` : ""}`
    : activeSpecialty
      ? `/?setting=${encodeURIComponent(activeSetting)}`
      : "/"

  const pageTitle = isAnatomyPage
    ? serviceLineLabel && anatomyLabel
      ? `${serviceLineLabel}: ${anatomyLabel}`
      : anatomyLabel ?? anatomy!
    : isOperatingTheatreOverviewPage
      ? activeSetting
      : activeSpecialty ?? activeSetting

  return (
    <div className="min-h-screen bg-[#F4F7FA] lg:bg-[#06111D]">
      <div className="hidden lg:block lg:fixed lg:inset-0 lg:pointer-events-none lg:bg-[radial-gradient(circle_at_top_left,_rgba(77,163,255,0.14),_transparent_26%),radial-gradient(circle_at_86%_14%,_rgba(20,184,166,0.12),_transparent_22%),linear-gradient(145deg,#06111D_0%,#091725_48%,#0B2134_100%)]" />
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#00B4D8] lg:border-b lg:border-white/8 lg:bg-[#08131F]/88 lg:backdrop-blur-2xl">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 pb-2.5 pt-[calc(env(safe-area-inset-top,0px)+8px)] lg:max-w-none lg:px-12 lg:py-5">
          <HistoryBackButton
            fallbackHref={backHref}
            className="shrink-0 text-[#10243E]/70 transition-colors hover:text-[#10243E] lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6 lg:text-white/60 lg:hover:text-white"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-[18px] font-medium leading-snug text-[#10243E] lg:text-[40px] lg:font-semibold lg:tracking-[-0.05em] lg:text-white">
              {pageTitle}
            </h1>

            {isOperatingTheatreOverviewPage ? (
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-[#10243E]/8 px-2 py-0.5 text-xs text-[#10243E]/68 lg:border lg:border-white/10 lg:bg-white/8 lg:px-4 lg:py-1.5 lg:text-[11px] lg:font-semibold lg:uppercase lg:tracking-[0.16em] lg:text-white/60">
                  Specialties
                </span>
              </div>
            ) : (
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${settingColour} lg:px-4 lg:py-1.5 lg:text-[11px] lg:uppercase lg:tracking-[0.16em]`}
                >
                  {activeSetting}
                </span>

                {activeSpecialty && (
                  <span className="rounded-full bg-[#10243E]/8 px-2 py-0.5 text-xs text-[#10243E]/68 lg:border lg:border-white/10 lg:bg-white/8 lg:px-4 lg:py-1.5 lg:text-[11px] lg:uppercase lg:tracking-[0.16em] lg:text-white/60">
                    {activeSpecialty}
                  </span>
                )}

                {isAnatomyPage && anatomyLabel && (
                  <span className="rounded-full bg-[#10243E]/8 px-2 py-0.5 text-xs text-[#10243E]/68 lg:border lg:border-white/10 lg:bg-white/8 lg:px-4 lg:py-1.5 lg:text-[11px] lg:uppercase lg:tracking-[0.16em] lg:text-white/60">
                    {anatomyLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            href="/"
            className="shrink-0 rounded-lg p-2 text-[#10243E]/70 transition-colors hover:bg-[#10243E]/8 hover:text-[#10243E] lg:flex lg:h-14 lg:w-14 lg:items-center lg:justify-center lg:rounded-[20px] lg:border lg:border-white/10 lg:bg-white/6 lg:text-white/60 lg:hover:bg-white/10 lg:hover:text-white"
            aria-label="Home"
          >
            <House size={18} />
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-4xl space-y-4 px-4 pb-28 pt-5 lg:max-w-none lg:space-y-8 lg:px-12 lg:pb-10 lg:pt-10">
        {isOperatingTheatreOverviewPage && (
          <OperatingTheatreTabs
            tabs={operatingTheatreTabs}
            selectedServiceLineId={service_line}
          />
        )}

        {isOperatingTheatreSpecialtyPage && (
          <OperatingTheatreTabs
            tabs={operatingTheatreTabs}
            selectedServiceLineId={service_line}
            specialtyFirst
          />
        )}

        {isAnatomyPage && (
          <ProcedureTabs
            procedures={theatreProcedures}
            selectedSystemId={system}
            palette={activeSpecialtyPalette}
          />
        )}
      </main>
    </div>
  )
}
