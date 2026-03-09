import { notFound } from "next/navigation"
import { getProcedureById, procedures } from "@/lib/data"
import ProcedurePageClient from "@/components/ProcedurePageClient"
import HistoryTracker from "@/components/HistoryTracker"
import {
  getProcedureVariantById,
  getSystemById,
} from "@/lib/variants"
import { buildSystemCardSections } from "@/lib/system-card"

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ variant?: string; system?: string }>
}

export function generateStaticParams() {
  return procedures.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { id } = await params
  const { variant, system } = await searchParams
  const procedure = getProcedureById(id)

  if (!procedure) {
    return { title: "Not Found" }
  }

  const procedureVariant = variant
    ? getProcedureVariantById(variant)
    : null
  const procedureSystem = system
    ? getSystemById(system)
    : null

  const titleParts = [
    procedure.name,
    procedureVariant?.name,
    procedureSystem?.name,
  ].filter(Boolean)

  return { title: `${titleParts.join(" | ")} | PrepSight` }
}

export default async function ProcedurePage({ params, searchParams }: Props) {
  const { id } = await params
  const { variant, system } = await searchParams
  const procedure = getProcedureById(id)
  if (!procedure) notFound()

  const procedureVariant = variant
    ? getProcedureVariantById(variant)
    : null
  const procedureSystem = system
    ? getSystemById(system)
    : null

  const cardSections =
    procedureVariant && procedureSystem
      ? buildSystemCardSections(
          procedure,
          procedureVariant.id,
          procedureVariant.name,
          procedureSystem.id,
          procedureSystem.name,
        )
      : procedure.sections

  return (
    <>
      <HistoryTracker
        id={procedure.id}
        variantId={procedureVariant?.id}
        systemId={procedureSystem?.id}
      />
      <ProcedurePageClient
        procedure={procedure}
        cardSections={cardSections}
        title={procedure.name}
        subtitle={procedureVariant?.name ?? procedure.approach}
        tertiaryLabel={procedureSystem?.name ?? procedure.implantSystem}
      />
    </>
  )
}
