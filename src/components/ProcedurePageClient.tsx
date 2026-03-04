"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import KardexSection from "./KardexSection"
import WatermarkOverlay from "./WatermarkOverlay"
import { Procedure } from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"
import { getProfile } from "@/lib/profile"

interface LastEdit {
  date: string
  by: string
}

function formatName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length < 2) return parts[0]
  return `${parts[0][0]}. ${parts[parts.length - 1]}`
}

function today(): string {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

interface Props {
  procedure: Procedure
}

export default function ProcedurePageClient({ procedure }: Props) {
  const [lastEdit, setLastEdit] = useState<LastEdit | null>(null)

  const settingColour = SETTING_COLOUR[procedure.setting] ?? "bg-gray-100 text-gray-700"

  // Split "Total Hip Replacement - Posterior Approach" into main + subtitle
  const dashIdx   = procedure.name.indexOf(" - ")
  const mainName  = dashIdx !== -1 ? procedure.name.slice(0, dashIdx) : procedure.name
  const subName   = dashIdx !== -1 ? procedure.name.slice(dashIdx + 3) : ""

  function handleSectionSave() {
    const profile = getProfile()
    const by = profile?.name ? formatName(profile.name) : "You"
    setLastEdit({ date: today(), by })
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <header className="bg-[#1E293B] border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-start gap-3">
          <Link href="/" className="text-white/60 hover:text-white transition-colors shrink-0 mt-0.5">
            <ArrowLeft size={20} />
          </Link>

          <div className="flex-1 min-w-0">
            {/* Row 1 — main procedure name */}
            <h1 className="font-bold text-base text-white leading-snug">{mainName}</h1>

            {/* Row 2 — approach subtitle */}
            {subName && (
              <p className="text-sm text-white/60 mt-0.5">{subName}</p>
            )}

            {/* Row 3 — implant system */}
            {procedure.implantSystem && (
              <p className="text-sm font-medium text-white/60 mt-0.5">{procedure.implantSystem}</p>
            )}

            {/* Row 4 — setting (left) | updated date (right) */}
            <div className="flex items-baseline justify-between gap-2 mt-1.5">
              <span className="text-xs font-semibold text-[#4DA3FF]">{procedure.setting}</span>
              {lastEdit && (
                <span className="text-[10px] text-white/40 shrink-0">Updated: {lastEdit.date}</span>
              )}
            </div>

            {/* Row 5 — specialty (left) | by (right) */}
            <div className="flex items-baseline justify-between gap-2 mt-0.5">
              <span className="text-xs text-white/40">{procedure.specialty}</span>
              {lastEdit && (
                <span className="text-[10px] text-white/40 shrink-0">by: {lastEdit.by}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 relative select-none">
        <WatermarkOverlay />
        {procedure.sections.map((section, i) => (
          <KardexSection
            key={section.id}
            section={section}
            defaultOpen={i === 0}
            onSave={handleSectionSave}
          />
        ))}
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
