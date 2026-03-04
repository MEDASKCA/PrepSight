import { procedures, getProceduresBySettingAndSpecialty } from "@/lib/data"
import { ClinicalSetting } from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ProcedureCard from "@/components/ProcedureCard"
import SpecialtySection from "@/components/SpecialtySection"
import HomeHero from "@/components/HomeHero"

interface Props {
  searchParams: Promise<{ setting?: string; specialty?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const { setting, specialty } = await searchParams

  const bySettingAndSpecialty = getProceduresBySettingAndSpecialty()

  let filteredProcedures = procedures
  let activeSetting: ClinicalSetting | undefined
  let activeSpecialty: string | undefined

  if (setting) {
    activeSetting = setting as ClinicalSetting
    filteredProcedures = procedures.filter((p) => p.setting === activeSetting)
    if (specialty) {
      activeSpecialty = specialty
      filteredProcedures = filteredProcedures.filter((p) => p.specialty === specialty)
    }
  }

  // ── No filter: home hero ──────────────────────────────────────────────────
  if (!activeSetting) {
    return <HomeHero />
  }

  // ── Filtered view ─────────────────────────────────────────────────────────
  const backHref = activeSpecialty
    ? `/?setting=${encodeURIComponent(activeSetting)}`
    : "/"

  const settingColour = SETTING_COLOUR[activeSetting] ?? "bg-gray-100 text-gray-700"

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      <header className="bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={backHref} className="text-white/60 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base text-white leading-snug">
              {activeSpecialty ?? activeSetting}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${settingColour}`}>
                {activeSetting}
              </span>
              {activeSpecialty && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                  {activeSpecialty}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-4">

        {/* Setting + specialty: compact list */}
        {activeSpecialty && (
          <div className="bg-white rounded-2xl overflow-hidden border border-[#D5DCE3] shadow-sm divide-y divide-[#F4F7FA]">
            {filteredProcedures.map((p) => (
              <ProcedureCard key={p.id} procedure={p} />
            ))}
            {filteredProcedures.length === 0 && (
              <p className="px-4 py-6 text-sm text-[#94a3b8]">No procedures in this specialty yet.</p>
            )}
          </div>
        )}

        {/* Setting only: collapsible specialty sections */}
        {!activeSpecialty && (() => {
          const specialtyMap = bySettingAndSpecialty.get(activeSetting!)
          if (!specialtyMap) {
            return <p className="text-sm text-[#94a3b8]">No procedures in this setting yet.</p>
          }
          return Array.from(specialtyMap.entries()).map(([spec, procs]) => (
            <SpecialtySection key={spec} specialty={spec} procedures={procs} />
          ))
        })()}

      </main>
    </div>
  )
}
