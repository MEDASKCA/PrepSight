import { procedures, getProceduresBySpecialty } from "@/lib/data"
import { ClinicalSetting, Procedure } from "@/lib/types"
import { SETTING_COLOUR, SETTING_SPECIALTIES } from "@/lib/settings"
import { ArrowLeft, House } from "lucide-react"
import Link from "next/link"
import HomeHero from "@/components/HomeHero"
import OperatingTheatreTabs from "@/components/OperatingTheatreTabs"
import ProcedureTabs from "@/components/ProcedureTabs"
import {
  getOperatingTheatreSpecialtyIdByLabel,
  getServiceLinesForSpecialty,
  getServiceLineNameById,
  getAnatomyNameById,
  getDescendantAnatomyIds,
} from "@/lib/operating-theatre-taxonomy"

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
  const isOperatingTheatreSpecialtiesPage = isOperatingTheatre && !anatomy
  const isAnatomyPage = isOperatingTheatre && !!activeSpecialty && !!anatomy

  const settingColour =
    SETTING_COLOUR[activeSetting] ?? "bg-gray-100 text-gray-700"

  const operatingTheatreTabs = isOperatingTheatre
    ? SETTING_SPECIALTIES["Operating Theatre"].map((spec) => {
        const specId = getOperatingTheatreSpecialtyIdByLabel(spec)
        const serviceLines = specId ? getServiceLinesForSpecialty(specId) : []

        return {
          name: spec,
          subspecialtyCount: serviceLines.length,
          serviceLines,
        }
      })
    : []

  const serviceLineLabel = service_line
    ? getServiceLineNameById(service_line) ?? service_line
    : undefined

  const anatomyLabel = anatomy
    ? getAnatomyNameById(anatomy) ?? anatomy
    : undefined

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

      theatreProcedures = theatreProcedures.filter((p) =>
        "anatomy_id" in p && allowedAnatomyIds.has(p.anatomy_id),
      )
    }
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
    : isOperatingTheatreSpecialtiesPage
      ? activeSetting
      : activeSpecialty ?? activeSetting

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#1E293B]">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
          <Link
            href={backHref}
            className="shrink-0 text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft size={20} />
          </Link>

          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold leading-snug text-white">
              {pageTitle}
            </h1>

            {isOperatingTheatreSpecialtiesPage ? (
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                  Specialties
                </span>
              </div>
            ) : (
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${settingColour}`}
                >
                  {activeSetting}
                </span>

                {activeSpecialty && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                    {activeSpecialty}
                  </span>
                )}

                {isAnatomyPage && anatomyLabel && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
                    {anatomyLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          <Link
            href="/"
            className="shrink-0 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Home"
          >
            <House size={18} />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 px-4 py-5">
        {isSettingOverview && !isOperatingTheatre && (
          <div className="space-y-3">
            {(SETTING_SPECIALTIES[activeSetting] ?? []).map((spec) => {
              const count = procedures.filter(
                (p) => p.setting === activeSetting && p.specialty === spec,
              ).length
              return (
                <Link
                  key={spec}
                  href={`/?setting=${encodeURIComponent(activeSetting)}&specialty=${encodeURIComponent(spec)}`}
                  className="flex items-center justify-between rounded-xl border border-[#D5DCE3] bg-white px-5 py-4 transition hover:border-[#4DA3FF]"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#3F4752]">{spec}</p>
                    {count > 0 && (
                      <p className="mt-0.5 text-xs text-[#94a3b8]">
                        {count} {count === 1 ? "procedure" : "procedures"}
                      </p>
                    )}
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-[#D5DCE3]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08-.02Z" clipRule="evenodd" />
                  </svg>
                </Link>
              )
            })}
          </div>
        )}

        {isOperatingTheatreSpecialtiesPage && (
          <OperatingTheatreTabs
            tabs={operatingTheatreTabs}
            selectedServiceLineId={service_line}
          />
        )}

        {isAnatomyPage && (
          <ProcedureTabs
            procedures={theatreProcedures}
            selectedSystemId={system}
          />
        )}
      </main>
    </div>
  )
}
