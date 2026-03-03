import Link from "next/link"
import { Procedure } from "@/lib/types"
import { SETTING_COLOUR } from "@/lib/settings"

interface Props {
  procedure: Procedure
}

export default function ProcedureCard({ procedure }: Props) {
  const settingColour = SETTING_COLOUR[procedure.setting] ?? "bg-gray-100 text-gray-700"

  return (
    <Link
      href={`/procedures/${procedure.id}`}
      className="block bg-white border border-[#D5DCE3] rounded-xl p-4 hover:border-[#4DA3FF] hover:shadow-sm transition-all"
    >
      <p className="font-semibold text-[#3F4752] leading-snug">
        {procedure.name}
      </p>
      {procedure.approach && (
        <p className="text-sm text-[#64748b] mt-0.5">{procedure.approach}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${settingColour}`}>
          {procedure.setting}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F7FA] text-[#64748b]">
          {procedure.specialty}
        </span>
        {procedure.implantSystem && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F7FA] text-[#64748b]">
            {procedure.implantSystem}
          </span>
        )}
      </div>
    </Link>
  )
}
