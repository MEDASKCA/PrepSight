import { ClinicalSetting, Procedure } from "./types"
import { procedures as seedProcedures } from "./seed-data/index"
import { canonicalSpecialtyName } from "./specialty-normalization"

function normalizeText(v?: string): string {
  return (v ?? "").trim().toLowerCase()
}

function normalizeProcedure(p: Procedure): Procedure {
  const sections = p.sections.map((section) =>
    section.sectionType === "procedure_reference"
      ? { ...section, title: "Operative References" }
      : section
  )
  return { ...p, sections }
}

export const procedures: Procedure[] = seedProcedures.map(normalizeProcedure)

export function getProcedureById(id: string): Procedure | undefined {
  return procedures.find((p) => normalizeText(p.id) === normalizeText(id))
}

export function getProceduresBySettingAndSpecialty(): Map<ClinicalSetting, Map<string, Procedure[]>> {
  const outer = new Map<ClinicalSetting, Map<string, Procedure[]>>()
  for (const p of procedures) {
    if (!outer.has(p.setting)) outer.set(p.setting, new Map())
    const inner = outer.get(p.setting)!
    const specialty = canonicalSpecialtyName(p.setting, p.specialty)
    const list = inner.get(specialty) ?? []
    list.push(p)
    inner.set(specialty, list)
  }
  return outer
}

export function getProceduresBySetting(setting: ClinicalSetting): Procedure[] {
  return procedures.filter((p) => p.setting === setting)
}

export function getProceduresBySpecialty(setting: ClinicalSetting, specialty: string): Procedure[] {
  const requestedSpecialty = canonicalSpecialtyName(setting, specialty)
  return procedures.filter(
    (p) => p.setting === setting && canonicalSpecialtyName(p.setting, p.specialty) === requestedSpecialty
  )
}
