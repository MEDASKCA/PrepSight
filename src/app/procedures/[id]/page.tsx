import { notFound } from "next/navigation"
import { getProcedureById, procedures } from "@/lib/data"
import ProcedurePageClient from "@/components/ProcedurePageClient"
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
  return { title: procedure ? `${procedure.name} | PrepSight` : "Not Found" }
}

export default async function ProcedurePage({ params }: Props) {
  const { id } = await params
  const procedure = getProcedureById(id)
  if (!procedure) notFound()

  return (
    <>
      <HistoryTracker id={procedure.id} />
      <ProcedurePageClient procedure={procedure} />
    </>
  )
}
