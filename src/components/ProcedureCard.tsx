import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Procedure } from "@/lib/types"

interface Props {
  procedure: Procedure
}

export default function ProcedureCard({ procedure }: Props) {
  return (
    <Link
      href={`/procedures/${procedure.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] active:bg-[#EFF8FF] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#3F4752] leading-snug">{procedure.name}</p>
        {procedure.approach && (
          <p className="text-xs text-[#94a3b8] mt-0.5">{procedure.approach}</p>
        )}
      </div>
      {procedure.implantSystem && (
        <span className="hidden sm:block text-xs text-[#94a3b8] shrink-0 max-w-[120px] truncate">
          {procedure.implantSystem}
        </span>
      )}
      <ChevronRight size={14} className="text-[#CBD5E1] shrink-0" />
    </Link>
  )
}
