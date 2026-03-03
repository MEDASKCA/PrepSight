import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProcedureById, procedures } from "@/lib/data"
import { SETTING_COLOUR } from "@/lib/settings"
import KardexSection from "@/components/KardexSection"
import ProfileButton from "@/components/ProfileButton"
import WatermarkOverlay from "@/components/WatermarkOverlay"
import HistoryTracker from "@/components/HistoryTracker"

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return procedures.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const procedure = getProcedureById(id)
  return { title: procedure ? `${procedure.name} — PrepSight` : "Not Found" }
}

export default async function ProcedurePage({ params }: Props) {
  const { id } = await params
  const procedure = getProcedureById(id)
  if (!procedure) notFound()

  const settingColour = SETTING_COLOUR[procedure.setting] ?? "bg-gray-100 text-gray-700"

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <header className="bg-[#003366] text-white sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition-colors shrink-0">
            <ArrowLeft size={22} />
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg leading-snug">
              {procedure.name}
            </h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${settingColour}`}>
                {procedure.setting}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                {procedure.specialty}
              </span>
              {procedure.implantSystem && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                  {procedure.implantSystem}
                </span>
              )}
            </div>
          </div>

          <ProfileButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 relative select-none">
        <HistoryTracker id={procedure.id} />
        <WatermarkOverlay />
        {procedure.sections.map((section, i) => (
          <KardexSection
            key={section.id}
            section={section}
            defaultOpen={i === 0}
          />
        ))}
        {/* Trust indicator */}
        <footer className="mt-6 pt-4 border-t border-[#D5DCE3]">
          <p className="text-xs text-[#94a3b8]">
            {procedure.updatedAt
              ? `Reviewed ${new Date(procedure.updatedAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })} · `
              : "Reviewed periodically · "}
            PrepSight editorial · Local policy applies
          </p>
        </footer>
      </main>
    </div>
  )
}
